import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

export const Middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] ?? "";

    // @ts-ignore
    const decoded = token.verify(token, JWT_SECRET);

    if( decoded ){
        // @ts-ignore
         req.userId = decoded.id;
         next();
    } else {
        res.status(403).json({
            message: "Unauthorized "
        })
    }
}