import express from "express";
import {
  enviarDato,
  obtenerEvaluacionInteroperabilidad,
} from "../controllers/interoperabilidad.controller.js";

const router = express.Router();

// Ruta para enviar datos a la ESP32
router.post("/enviar-dato", enviarDato);

// Ruta para obtener métricas de interoperabilidad
router.get("/evaluacion-interoperabilidad", obtenerEvaluacionInteroperabilidad);

export default router;
