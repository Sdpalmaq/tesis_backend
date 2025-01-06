import HuellasDactilares from "../models/huellas_dactilares.model.js";
import { publishMessage } from "../config/mqtt.config.js";
import pool from "../config/database.js";

export const registrarHuella = async (req, res) => {
  try {
    const { id_esp32, id_huella, nombre_persona, dedo, usuario_cedula, vehiculo_id } = req.body;

    // Verificar si ya existe la huella para esta placa e ID
    const existingHuella = await HuellasDactilares.findByIdEsp32AndHuella(id_esp32, id_huella);

    if (existingHuella) {
      return res.status(400).json({ error: "La huella ya está registrada en esta placa." });
    }

    // Publicar al tópico MQTT para iniciar registro de huella en la placa
    const topic = `sistema/${id_esp32}/huella/registrar`;
    const message = JSON.stringify({ id_huella, nombre_persona, dedo });
    publishMessage(topic, message);

    // Guardar la huella en la base de datos
    const nuevaHuella = await HuellasDactilares.create({
      id_esp32,
      id_huella,
      nombre_persona,
      dedo,
      usuario_cedula,
      vehiculo_id,
    });

    res.status(201).json({
      message: "Solicitud enviada a la placa y huella registrada en la base de datos.",
      data: nuevaHuella,
    });
  } catch (error) {
    console.error("Error al registrar huella:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const eliminarHuella = async (req, res) => {
  try {
    const { id_esp32, id_huella } = req.params;

    // Eliminar huella de la base de datos
    const deleted = await HuellasDactilares.deleteByIdEsp32AndHuella(id_esp32, id_huella);

    if (!deleted) {
      return res.status(404).json({ error: "No se encontró la huella en la base de datos." });
    }

    // Publicar al tópico MQTT para eliminar huella en la placa
    const topic = `sistema/${id_esp32}/huella/eliminar`;
    const message = JSON.stringify({ id_huella });
    publishMessage(topic, message);

    res.status(200).json({ message: "Huella eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar huella:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

// Obtener huellas dactilares de un vehículo
export const getHuellasByVehiculo = async (req, res) => {
  const { vehiculo_id } = req.params;

  try {
    // Consulta para obtener las huellas del vehículo
    const query = `
      SELECT id_huella, nombre_persona, dedo, fecha_registro, id_esp32
      FROM huellas_dactilares
      WHERE vehiculo_id = $1
    `;
    const { rows } = await pool.query(query, [vehiculo_id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron huellas para este vehículo." });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener huellas:", error);
    res
      .status(500)
      .json({ message: "Error al obtener las huellas del vehículo." });
  }
};