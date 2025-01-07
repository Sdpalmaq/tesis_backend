import mqttClient from "../config/mqtt.config.js";

/**
 * Controlador para restaurar el sistema de una ESP32 específica.
 */
export const restaurarSistema = async (req, res) => {
  try {
    const { id_esp32 } = req.params;

    if (!id_esp32) {
      return res.status(400).json({ message: "El id_esp32 es requerido." });
    }

    // Crear el mensaje y tópico dinámico
    const topic = `sistema/${id_esp32}/sistema/restaurar`;
    const message = JSON.stringify({ action: "restaurar" });

    // Publicar mensaje al tópico MQTT
    mqttClient.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error("Error al publicar mensaje MQTT:", err);
        return res
          .status(500)
          .json({ message: "Error al enviar comando de restauración." });
      }
      return res.status(200).json({
        message: `Comando de restauración enviado a la placa ${id_esp32} exitosamente.`,
      });
    });
  } catch (error) {
    console.error("Error al restaurar sistema:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
