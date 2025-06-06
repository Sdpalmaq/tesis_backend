import express from "express";
import {
  getConfiguracionById,
  getConfiguraciones,
  associateConfiguracion,
  deleteConfiguracion,
  getEsp32Status,
  getESP32Dis,
} from "../controllers/configuraciones_sistema.controller.js";

const router = express.Router();

// Crear una nueva placa ESP32
//router.post("/", createConfiguracion);

// Obtener todas las placas ESP32
router.get("/", getConfiguraciones);

// Obtener todas las placas ESP32 
router.get("/esp32-dis", getESP32Dis);

// Obtener una placa ESP32 por ID
router.get("/:id_esp32", getConfiguracionById);

// Asociar una placa ESP32 con un vehículo
router.put("/:id_esp32", associateConfiguracion);

// Eliminar una placa ESP32
router.delete("/:id_esp32", deleteConfiguracion);

router.get("/esp32/:id_esp32", getEsp32Status);

export default router;
