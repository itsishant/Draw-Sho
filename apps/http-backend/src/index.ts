import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { Middleware } from "./middleware";

const app = express();

app.post("/signup", (req, res) => {

    const { username, password } = req.body;
    
    const token = jwt.sign( {},
         JWT_SECRET);
})

app.post("/signin", (req, res) => {


})

app.post("/room", Middleware, (req, res) => {
    res.json{
        id: "roomId"
    }
})

app.listen(3000);
