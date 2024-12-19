import express from "express";
import {
  getConfiguracionByKey,
  upsertConfiguracion,
  getAllConfiguraciones,
  registrarESP32,
} from "../controllers/configuraciones_sistema.controller.js";

const router = express.Router();

// Ruta para registrar configuración ESP32
router.post("/registrar-esp32", registrarESP32);

// Ruta para obtener configuración por clave
router.get("/:clave", getConfiguracionByKey);

// Ruta para crear o actualizar configuración
router.post("/", upsertConfiguracion);

// Ruta para obtener todas las configuraciones
router.get("/", getAllConfiguraciones);

export default router;
