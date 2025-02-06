import { publishMessage, subscribeToTopic } from "../config/mqtt.config.js";

// Variables de medición
let totalDatosRecibidos = 0; // B: Total de datos recibidos de la app móvil
let datosSinErrores = 0; // A: Datos publicados correctamente en MQTT

export const enviarDato = async (req, res) => {
  const { id_esp32, mensaje } = req.body;

  if (!id_esp32 || !mensaje) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  totalDatosRecibidos++; // Contabilizar intento de envío

  // Publicar mensaje en MQTT
  const topic = `sistema/${id_esp32}/datos`;
  publishMessage(topic, JSON.stringify({ mensaje }), (error) => {
    if (!error) {
      datosSinErrores++; // Aumentar conteo si se publicó sin error
    }
  });

  res.status(200).json({ message: "Dato enviado correctamente" });
};

// 📌 Endpoint para obtener métricas de interoperabilidad
export const obtenerEvaluacionInteroperabilidad = (req, res) => {
  const tasaIntercambio =
    totalDatosRecibidos > 0
      ? (datosSinErrores / totalDatosRecibidos).toFixed(2)
      : 0;

  res.json({
    totalDatosRecibidos,
    datosSinErrores,
    tasaIntercambio,
  });
};
