import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import bcrypt from "bcrypt";
import { email, unknown } from "zod/v4";
import {  CreateUserSchema, SigninSchema } from "@repo/common/types";
import { body } from "motion/react-client";
import { prisma } from "@repo/db/client"
import { _email } from "zod/v4/core";

const app = express();
app.use(express.json());
const PORT = 3000;


app.post("/signup", async (req, res) => {
    
    const { email, password, name: userName } = req.body;
    const data = CreateUserSchema.safeParse(req.body);

    if(!data.success){
        return res.status(400).json({
            messasge: "Invaild inputs"
        })
    }
    try {

        const existingUser = await prisma.user.findUnique({
            where: { email }
        }
        )

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this username"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                name: userName
            }
        })
        
        const token = jwt.sign({
            id: newUser.id
        }, JWT_SECRET)

        return res.status(200).json({
            messgae: "user created successfully",
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

app.post("/signin", async (req, res) => {

    const { email, password } = req.body;
    const data = SigninSchema.safeParse(req.body);

    if(!data.success) {
        return res.json({
            message: "Invaild inputs"
        })
    }

    try {

        const findUser = await prisma.user.findUnique({
            where: { email }
        })

        if (!findUser) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        //@ts-ignore
        const comparePassword = await bcrypt.compare(password, findUser.password); 
        if (!comparePassword) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({
            id: findUser.id
        }, JWT_SECRET);

        return res.status(200).json({
            message: "User signed in successfully",
            token: token
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }

})

app.listen(PORT, () =>  {
    console.log(`Server is running at ${PORT}`)
})
