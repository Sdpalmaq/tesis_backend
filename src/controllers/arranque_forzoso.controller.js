import { publishMessage, subscribeToTopic } from "../config/mqtt.config.js";

export const forzarArranque = async (req, res) => {
  try {
    const { id_esp32 } = req.body;

    // Validar que se haya proporcionado id_esp32
    if (!id_esp32) {
      return res.status(400).json({ error: "El id_esp32 es requerido." });
    }

    // Tópico para enviar el comando de arranque
    const topic = `sistema/${id_esp32}/encendido/forzoso`;
    const message = JSON.stringify({ action: "activar" });

    // Publicar el mensaje al tópico MQTT
    publishMessage(topic, message);

    // Escuchar el tópico de respuesta
    const responseTopic = `sistema/${id_esp32}/encendido/respuesta`;

    subscribeToTopic(responseTopic, (receivedMessage) => {
      const parsedMessage = JSON.parse(receivedMessage);

      // Validar la respuesta
      if (parsedMessage && parsedMessage.status === "success") {
        res.status(200).json({
          message: "Arranque forzoso exitoso.",
          data: parsedMessage,
        });
      } else {
        res.status(500).json({
          error: "Error en el arranque forzoso.",
          details: parsedMessage,
        });
      }
    });

    // Confirmación inicial de que el comando fue enviado
    res.status(200).json({ message: "Comando enviado a la placa ESP32." });
  } catch (error) {
    console.error("Error al forzar arranque:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};
