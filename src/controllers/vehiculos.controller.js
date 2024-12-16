import Vehiculo from "../models/vehiculos.model.js";
import Usuarios from "../models/user.model.js";

export const createVehiculo = async (req, res) => {
  try {
    const { placa, marca, modelo, anio, propietario_cedula } = req.body;

    // Validar si propietario_cedula está presente
    if (!propietario_cedula) {
      return res
        .status(400)
        .json({ message: "El campo propietario_cedula es obligatorio" });
    }

    // Validar que propietario_cedula cumpla con el formato esperado
    if (propietario_cedula.length !== 10) {
      return res
        .status(400)
        .json({ message: "La cédula del propietario debe tener 10 dígitos" });
    }

    // Verificar si el propietario existe
    const propietario = await Usuarios.findByCedula(propietario_cedula);
    if (!propietario) {
      return res.status(400).json({ message: "El propietario no existe" });
    }

    // Crear el vehículo
    const vehiculo = await Vehiculo.create(req.body);

    // Actualizar el campo tiene_vehiculo del propietario
    await Usuarios.updateTieneVehiculo(propietario_cedula, true);

    res.status(201).json(vehiculo);
  } catch (error) {
    if (error.constraint === "vehiculos_placa_key") {
      return res.status(400).json({ error: "La placa ya está registrada" });
    }
    console.error("Create vehiculo error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { propietario_cedula, placa, marca, modelo, anio } = req.body;

    // Verificar si el propietario existe antes de actualizar
    if (propietario_cedula) {
      const propietario = await Usuarios.findByCedula(propietario_cedula);
      if (!propietario) {
        return res.status(400).json({
          message: "El propietario con la cédula proporcionada no existe",
        });
      }
    }

    const updatedVehiculo = await Vehiculo.update(id, req.body);

    if (!updatedVehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    res.status(200).json(updatedVehiculo);
  } catch (error) {
    if (error.constraint === "vehiculos_placa_key") {
      return res.status(400).json({ error: "La placa ya esta registrada" });
    }
    console.error("Update vehiculo error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehiculo.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    console.error("Delete vehiculo error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Validar/Rechazar un vehículo
export const validateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { validado, comentarios_admin } = req.body;

    const vehiculo = await Vehiculo.validate(id, validado, comentarios_admin);
    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    res.status(200).json(vehiculo);
  } catch (error) {
    console.error("Error validando vehículo:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener vehículos pendientes de validación
export const getPendingVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findPendingValidation();
    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error obteniendo vehículos pendientes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const getVehiculos = async (req, res) => {
  try {
    const { propietario_cedula } = req.query;

    if (propietario_cedula) {
      // Obtener vehículos de un propietario específico
      const vehiculos = await Vehiculo.findByPropietario(propietario_cedula);
      return res.status(200).json(vehiculos);
    }

    // Obtener todos los vehículos
    const vehiculos = await Vehiculo.findAll();
    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Get vehiculos error:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
