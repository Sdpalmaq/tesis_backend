import ConfiguracionSistema from "../models/configuraciones_sistema.model.js";

// Obtener configuración por clave
export const getConfiguracionByKey = async (req, res) => {
  try {
    const { clave } = req.params;

    const config = await ConfiguracionSistema.findByKey(clave);

    if (!config) {
      return res.status(404).json({
        status: "error",
        message: `Configuración con clave '${clave}' no encontrada.`,
      });
    }

    res.status(200).json({
      status: "success",
      data: config,
    });
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({
      status: "error",
      message: "Error en el servidor al obtener configuración.",
    });
  }
};

// Crear o actualizar configuración
export const upsertConfiguracion = async (req, res) => {
  try {
    const { clave, valor, descripcion } = req.body;

    if (!clave || !valor) {
      return res.status(400).json({
        status: "error",
        message: "Clave y valor son obligatorios.",
      });
    }

    const updatedConfig = await ConfiguracionSistema.upsert(
      clave,
      valor,
      descripcion
    );

    res.status(200).json({
      status: "success",
      message: "Configuración guardada correctamente.",
      data: updatedConfig,
    });
  } catch (error) {
    console.error("Error al crear/actualizar configuración:", error);
    res.status(500).json({
      status: "error",
      message: "Error en el servidor al guardar configuración.",
    });
  }
};

// Obtener todas las configuraciones
export const getAllConfiguraciones = async (req, res) => {
  try {
    const configs = await ConfiguracionSistema.findAll();

    res.status(200).json({
      status: "success",
      data: configs,
    });
  } catch (error) {
    console.error("Error al obtener todas las configuraciones:", error);
    res.status(500).json({
      status: "error",
      message: "Error en el servidor al obtener configuraciones.",
    });
  }
};

export const registrarESP32 = async (req, res) => {
  const { id_esp32, ip_address, ssid } = req.body;

  if (!id_esp32 || !ssid || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const configuraciones = await ConfiguracionSistema.registrarESP32(
      id_esp32,
      ip_address,
      ssid
    );
    res
      .status(200)
      .json({ message: "Configuración registrada", configuraciones });
  } catch (error) {
    console.error("Error al registrar configuración:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
