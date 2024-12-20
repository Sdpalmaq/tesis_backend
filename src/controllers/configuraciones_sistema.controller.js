import ConfiguracionSistema from "../models/configuraciones_sistema.model.js";

// Crear una nueva placa ESP32
export const createConfiguracion = async (req, res) => {
  try {
    const { id_esp32, descripcion } = req.body;

    if (!id_esp32) {
      return res.status(400).json({ error: "El campo id_esp32 es obligatorio." });
    }

    const nuevaConfiguracion = await ConfiguracionSistema.create(id_esp32, descripcion);
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
      return res.status(400).json({ error: "El campo descripcion es obligatorio." });
    }

    const configuracionActualizada = await ConfiguracionSistema.associate(id_esp32, descripcion);

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
