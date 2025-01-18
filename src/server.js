import { WebSocketServer } from "ws";
import app from "./app.js"; // Tu app de Express
import { subscribeToTopic } from "./config/mqtt.config.js";

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Crear servidor WebSocket
const wss = new WebSocketServer({ server });

// Manejar conexiones WebSocket
wss.on("connection", (ws) => {
  console.log("Cliente conectado a WebSocket");

  ws.on("close", () => {
    console.log("Cliente desconectado de WebSocket");
  });
});

// Suscribirse al tópico MQTT para eventos de ESP32
subscribeToTopic("sistema/+/notificaciones", (message, id_esp32) => {
  console.log(`Evento recibido del dispositivo ${id_esp32}:`, message);

  // Retransmitir el evento a todos los clientes WebSocket conectados
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ id: esp32Id, message: message.toString() }));
    }
  });
});

export { wss };
