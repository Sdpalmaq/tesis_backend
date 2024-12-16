import RegistroAcceso from "../models/registro_acceso.model.js";

// Crear registro de acceso
export const createRegistroAcceso = async (req, res) => {
  try {
    const registro = await RegistroAcceso.create(req.body);
    res.status(201).json(registro);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el registro de acceso", error });
  }
};

// Obtener todos los registros de acceso
export const getRegistrosAcceso = async (req, res) => {
  try {
    const registros = await RegistroAcceso.findAll();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los registros de acceso", error });
  }
};
