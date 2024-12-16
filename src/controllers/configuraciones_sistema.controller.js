import ConfiguracionSistema from "../models/configuraciones_sistema.model.js";

// Crear o actualizar configuración
export const upsertConfiguracion = async (req, res) => {
  try {
    const { clave, valor, descripcion } = req.body;
    const configuracion = await ConfiguracionSistema.upsert(clave, valor, descripcion);
    res.status(201).json(configuracion);
  } catch (error) {
    res.status(500).json({ message: "Error al crear o actualizar la configuración", error });
  }
};

// Obtener todas las configuraciones
export const getConfiguraciones = async (req, res) => {
  try {
    const configuraciones = await ConfiguracionSistema.findAll();
    res.json(configuraciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las configuraciones", error });
  }
};
