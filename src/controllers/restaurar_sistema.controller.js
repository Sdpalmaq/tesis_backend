import mqttClient from "../config/mqtt.config.js";
import pool from "../config/database.js"; // Importa tu pool o client

export const restaurarSistema = async (req, res) => {
  try {
    const { id_esp32 } = req.params;

    if (!id_esp32) {
      return res.status(400).json({ message: "El id_esp32 es requerido." });
    }

    // 1. Enviar comando MQTT
    const topic = `sistema/${id_esp32}/sistema/restaurar`;
    const message = JSON.stringify({ action: "restaurar" });

    mqttClient.publish(topic, message, { qos: 1 }, async (err) => {
      if (err) {
        console.error("Error al publicar mensaje MQTT:", err);
        return res
          .status(500)
          .json({ message: "Error al enviar comando de restauración." });
      }

      try {
        // 2. Borrar huellas de la base de datos
        const deleteQuery = `DELETE FROM huellas_dactilares WHERE id_esp32 = $1`;
        await pool.query(deleteQuery, [id_esp32]);

        return res.status(200).json({
          message: `Sistema restaurado: comando enviado a ESP32 (${id_esp32}) y huellas eliminadas en la base de datos.`,
        });
      } catch (dbError) {
        console.error("Error al eliminar huellas en la BD:", dbError);
        return res.status(500).json({
          message: "Comando enviado, pero falló la eliminación en la base de datos.",
        });
      }
    });
  } catch (error) {
    console.error("Error al restaurar sistema:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
