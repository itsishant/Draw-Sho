import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { User } from "./schema/user.schema";
import bcrypt from "bcrypt";
import { unknown } from "zod/v4";
import {  CreateUserSchema } from "@repo/common/types";
import { body } from "motion/react-client";

const app = express();

app.post("/signup", async (req, res) => {
    
    const { username, password } = req.body;
    const data = CreateUserSchema.safeParse(req.body);

    if(!data){
        return res.json({
            messasge: "Invaild inputs"
        })
    }
    try {

        const existingUser = await User.findOne({
            username
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this username"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: passwordHash
        })
        
        const token = jwt.sign({
            id: newUser._id
        }, JWT_SECRET)

        return res.status(200).json({
            messgae: "user created successfully",
            token: token
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

})

app.post("/signin", async (req, res) => {

    const { username, password } = req.body;

    try {

        const findUser = await User.findOne({
            username,
            password
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
            id: findUser._id
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

app.post("/room", middleware, (req, res) => {
    
})

app.listen(3000);
