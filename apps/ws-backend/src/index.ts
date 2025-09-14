import { request } from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
    ws.on("message", function message(message) {

        // @ts-ignore
        const url = request.url as unknown as string;

        if(!url){
            return;
        }

        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token") || "";
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded) {
            ws.close();
            return;
        }

        ws.send("Hello from server 8080");
    }) 
})
