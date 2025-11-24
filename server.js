import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (raw) => {
    const text = raw.toString();
    console.log("📩 Received:", text);

    // Try to parse JSON
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch (err) {
      console.log("⚠️ Not JSON. Broadcasting raw");
      broadcastRaw(text);
      return;
    }

    // TYPING EVENT
    if (payload.type === "typing") {
      broadcastJSON(payload);
      return;
    }

    // NORMAL CHAT MESSAGE
    broadcastJSON(payload);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Broadcast JSON to all connected clients
function broadcastJSON(data) {
  const jsonData = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(jsonData);
    }
  });
}

// Broadcast raw text
function broadcastRaw(text) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(text);
    }
  });
}

app.get("/", (_req, res) => {
  res.send("WebSocket server running: aryanChatServer");
});

// Render will inject PORT automatically
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🚀 Running on port ${PORT}`);
});
