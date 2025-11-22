import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    // Broadcast JSON to everyone
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

app.get("/", (_req, res) => {
  res.send("WebSocket server running: chat-server-aryan");
});

server.listen(10000, () => {
  console.log("🚀 Running on port 10000");
});
