import Vehiculo from "../models/vehiculos.model.js";
import Usuarios from "../models/user.model.js";
import pool from "../config/database.js";
import { associateConfiguracion } from "./configuraciones_sistema.controller.js"; // Importar función

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

export const getVehiculosByPropietario = async (req, res) => {
  try {
    const { propietario_cedula } = req.params; // Obtener el ID del propietario de los parámetros
    const vehiculos = await Vehiculo.findByPropietario(propietario_cedula);

    if (!vehiculos.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron vehículos para este usuario." });
    }

    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

// Asociar ESP32 a un vehículo
export const associateESP32 = async (req, res) => {
  const { id, id_esp32 } = req.body; // id = ID del vehículo

  try {
    // Verificar si el vehículo existe
    const vehiculo = await pool.query("SELECT * FROM vehiculos WHERE id = $1", [
      id,
    ]);
    if (vehiculo.rows.length === 0) {
      return res.status(404).json({ error: "❌ Vehículo no encontrado" });
    }

    // Verificar si la ESP32 existe en la base de datos
    const esp32 = await pool.query(
      "SELECT * FROM configuraciones_sistema WHERE id_esp32 = $1",
      [id_esp32]
    );

    if (esp32.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "❌ ESP32 no encontrada en la base de datos" });
    }

    // Verificar si la ESP32 ya está asociada a otro vehículo
    const vehiculoExistente = await pool.query(
      "SELECT * FROM vehiculos WHERE id_esp32 = $1",
      [id_esp32]
    );

    if (vehiculoExistente.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "⚠️ Esta ESP32 ya está asociada a otro vehículo" });
    }

    // Asociar la ESP32 al vehículo
    const updatedVehiculo = await pool.query(
      "UPDATE vehiculos SET id_esp32 = $1 WHERE id = $2 RETURNING *",
      [id_esp32, id]
    );

    // Actualizar el estado de asociado en configuraciones_sistema
    const reqAsociacion = {
      params: { id_esp32 },
      body: { descripcion: "ESP32 asignada a un vehículo" },
    };
    await associateConfiguracion(reqAsociacion, res);

    res.status(200).json({
      message: "✅ ESP32 asociada correctamente al vehículo.",
      vehiculo: updatedVehiculo.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al asociar ESP32:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
