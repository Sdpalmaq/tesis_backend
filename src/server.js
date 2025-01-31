import { WebSocketServer } from "ws";
import app from "./app.js"; // Tu app de Express
import { subscribeToTopic } from "./config/mqtt.config.js";

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

// Manejar conexiones WebSocket con más detalle
wss.on("connection", (ws) => {
  console.log("Cliente conectado a WebSocket");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      // Procesar mensajes adicionales si es necesario
    } catch (error) {
      console.error("Error procesando mensaje", error);
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado de WebSocket");
  });
});

// Función para transmitir eventos
function transmitirEvento(mensaje) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(mensaje));
    }
  });
}

// Suscribir a tópicos MQTT
subscribeToTopic("sistema/eventos", (message) => {
  try {
    const evento = JSON.parse(message);
    transmitirEvento(evento);
  } catch (error) {
    console.error("Error procesando evento MQTT", error);
  }
});

export { wss };
