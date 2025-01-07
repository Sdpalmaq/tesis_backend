import { WebSocketServer } from "ws";
import app from "./app.js"; // Tu app de Express

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Crear servidor WebSocket
const wss = new WebSocketServer({ server });

// Manejar conexiones WebSocket
wss.on("connection", (ws) => {
  console.log("Cliente conectado a WebSocket");

  ws.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);
    // Manejar mensajes recibidos
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado de WebSocket");
  });
});

export { wss };
