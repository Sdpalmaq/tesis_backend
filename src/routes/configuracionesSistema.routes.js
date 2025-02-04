import express from "express";
import {
  createConfiguracion,
  getConfiguracionById,
  getConfiguraciones,
  associateConfiguracion,
  deleteConfiguracion,
  getEsp32Status,
  getESP32Disponibles,
} from "../controllers/configuraciones_sistema.controller.js";

const router = express.Router();

// Crear una nueva placa ESP32
router.post("/", createConfiguracion);

// Obtener todas las placas ESP32
router.get("/", getConfiguraciones);

// Obtener una placa ESP32 por ID
router.get("/:id_esp32", getConfiguracionById);

// Asociar una placa ESP32 con un vehículo
router.put("/:id_esp32", associateConfiguracion);

// Eliminar una placa ESP32
router.delete("/:id_esp32", deleteConfiguracion);

router.get("/esp32/:id_esp32", getEsp32Status);

router.get("/esp32-disponibles", getESP32Disponibles);

export default router;
