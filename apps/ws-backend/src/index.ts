import { request } from "http";
import WebSocket,{ WebSocketServer} from "ws";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

const ws = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket
    rooms: string[],
    userId: string 
}

const users: User[] = [];

function checkUser(token: string): string | null {
   try {

     const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
        return null;
    }

    if(!decoded || !decoded.id) {
        return null;
    }

    return decoded.id;

   } catch (error) {
    return null;
   }
   return null
}

ws.on("connection", (ws, req) => {
    const url = req.url || "";
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (!userId) {
        ws.close(1008, "Invalid token");
        return;
    }

    const user: User = { userId, rooms: [], ws };
    users.push(user);

    ws.send("Hello from server 8080");

    ws.on("message", async (raw) => {
        let parsedData;
    try {
        parsedData = JSON.parse(raw.toString());
    } catch (err) {
        console.error("❌ Invalid JSON from client:", raw.toString());
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
        return;
    }

    if (parsedData.type === "join_room") {
        user.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
        user.rooms = user.rooms.filter(r => r !== parsedData.roomId);
    }

    await prisma.chat.create({
        data: {
            roomId,
            message,
            userId
        }
    })

    if (parsedData.type === "chat") {
        const { roomId, message } = parsedData;
        users.forEach(u => {
            if (u.rooms.includes(roomId)) {
                u.ws.send(JSON.stringify({ type: "chat", message, roomId }));
            }
        });
    }
    });
});