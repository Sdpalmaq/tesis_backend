import { sendNotification } from "../config/mqtt.config.js";

export const enviarNotificacion = (req, res) => {
  const { id_esp32, message } = req.body;

  if (!id_esp32 || !message) {
    return res
      .status(400)
      .json({ error: "id_esp32 y mensaje son requeridos." });
  }

  // Enviar notificación vía MQTT
  sendNotification(id_esp32, message);

  // Verificar si WebSocket está disponible
  if (req.wss && req.wss.clients) {
    req.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify({ id_esp32, message }));
      }
    });
  } else {
    console.error("WebSocket Server no disponible en esta petición.");
  }

  res.status(200).json({ success: true, message: "Notificación enviada." });
};
