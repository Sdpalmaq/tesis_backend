import mqttClient from "../config/mqtt.config.js";

export const configureWiFi = (req, res) => {
  const { id_esp32 } = req.params;
  const { ssid, password } = req.body;

  if (!ssid || !password) {
    return res.status(400).json({
      status: "error",
      message: "El SSID y la contraseña son requeridos.",
    });
  }

  const topic = `sistema/${id_esp32}/wifi/configurar`;
  const message = JSON.stringify({ ssid, password });

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error("Error publicando en MQTT:", err);
      return res.status(500).json({
        status: "error",
        message: "No se pudo enviar la configuración.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Configuración enviada correctamente.",
    });
  });
};
