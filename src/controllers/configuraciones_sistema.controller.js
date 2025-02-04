import ConfiguracionSistema from "../models/configuraciones_sistema.model.js";
import axios from "axios";
import pool from "../config/database.js";

// Crear una nueva placa ESP32
export const createConfiguracion = async (req, res) => {
  try {
    const { id_esp32, descripcion } = req.body;

    if (!id_esp32) {
      return res
        .status(400)
        .json({ error: "El campo id_esp32 es obligatorio." });
    }

    // Verificar si la ESP32 ya está registrada
    const existingConfig = await pool.query(
      "SELECT * FROM configuraciones_sistema WHERE id_esp32 = $1",
      [id_esp32]
    );

    if (existingConfig.rows.length > 0) {
      return res
        .status(200)
        .json({
          message: "⚠️ La ESP32 ya está registrada.",
          data: existingConfig.rows[0],
        });
    }

    const nuevaConfiguracion = await ConfiguracionSistema.create(
      id_esp32,
      descripcion
    );
    res.status(201).json(nuevaConfiguracion);
  } catch (error) {
    console.error("Error al crear la configuración:", error);
    res.status(500).json({ error: "Error al crear la configuración." });
  }
};

// Obtener una placa ESP32 por ID
export const getConfiguracionById = async (req, res) => {
  try {
    const { id_esp32 } = req.params;
    const configuracion = await ConfiguracionSistema.findById(id_esp32);

    if (!configuracion) {
      return res.status(404).json({ error: "Placa ESP32 no encontrada." });
    }

    res.json(configuracion);
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    res.status(500).json({ error: "Error al obtener la configuración." });
  }
};

// Obtener todas las placas ESP32 registradas
export const getConfiguraciones = async (req, res) => {
  try {
    const configuraciones = await ConfiguracionSistema.findAll();
    res.json(configuraciones);
  } catch (error) {
    console.error("Error al obtener configuraciones:", error);
    res.status(500).json({ error: "Error al obtener configuraciones." });
  }
};

// Asociar una placa ESP32 con un vehículo
export const associateConfiguracion = async (req, res) => {
  try {
    const { id_esp32 } = req.params;
    const { descripcion } = req.body;

    if (!descripcion) {
      return res
        .status(400)
        .json({ error: "El campo descripcion es obligatorio." });
    }

    const configuracionActualizada = await ConfiguracionSistema.associate(
      id_esp32,
      descripcion
    );

    if (!configuracionActualizada) {
      return res.status(404).json({ error: "Placa ESP32 no encontrada." });
    }

    res.json(configuracionActualizada);
  } catch (error) {
    console.error("Error al asociar la configuración:", error);
    res.status(500).json({ error: "Error al asociar la configuración." });
  }
};

// Eliminar una placa ESP32
export const deleteConfiguracion = async (req, res) => {
  try {
    const { id_esp32 } = req.params;

    const eliminado = await ConfiguracionSistema.delete(id_esp32);

    if (!eliminado) {
      return res.status(404).json({ error: "Placa ESP32 no encontrada." });
    }

    res.json({ message: "Configuración eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar la configuración:", error);
    res.status(500).json({ error: "Error al eliminar la configuración." });
  }
};

// Obtener status de la placa ESP32
export const checkEsp32Connectivity = async (req, res) => {
  const { id_esp32 } = req.params;

  // Las IP estáticas de las placas en modo remoto y local
  const remoteIP = "192.168.1.100"; // IP en modo remoto
  const localIP = "192.168.4.1"; // IP en modo Access Point

  try {
    // Intentar conectarse al modo remoto primero
    const remoteURL = `http://${remoteIP}/status`;
    try {
      const remoteResponse = await axios.get(remoteURL, { timeout: 5000 });
      return res.status(200).json({
        message: "ESP32 conectada en modo remoto.",
        mode: "remote",
        data: remoteResponse.data,
      });
    } catch (error) {
      console.warn("No se pudo conectar en modo remoto:", error.message);
    }

    // Si falla el modo remoto, intentar conectarse al modo local
    const localURL = `http://${localIP}/status`;
    try {
      const localResponse = await axios.get(localURL, { timeout: 5000 });
      return res.status(200).json({
        message: "ESP32 conectada en modo local.",
        mode: "local",
        data: localResponse.data,
      });
    } catch (error) {
      console.warn("No se pudo conectar en modo local:", error.message);
    }

    // Si ambos fallan, devolver error
    return res.status(404).json({
      message:
        "No se pudo conectar a la ESP32 ni en modo remoto ni en modo local.",
    });
  } catch (error) {
    console.error("Error al verificar conectividad:", error.message);
    return res.status(500).json({
      message: "Error al verificar conectividad con la ESP32.",
      error: error.message,
    });
  }
};

export const getEsp32Status = async (req, res) => {
  try {
    const { id_esp32 } = req.params;

    // Verificar si la placa está registrada en la base de datos
    const config = await ConfiguracionSistema.findById(id_esp32);

    if (!config) {
      return res.status(404).json({
        message: `No se encontró una configuración para la ESP32 con ID ${id_esp32}.`,
      });
    }

    // Simular verificación remota
    const esp32Status = {
      mode: "remote", // Esto indica que está en modo remoto (puedes ajustarlo según la lógica real)
      data: {
        connected: true,
        ssid: config.ssid || "N/A",
        ip: config.ip_address || "192.168.1.100",
      },
    };

    return res.status(200).json({
      message: "ESP32 conectada en modo remoto.",
      ...esp32Status,
    });
  } catch (error) {
    console.error("Error al obtener el estado de la ESP32:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el estado de la ESP32." });
  }
};
