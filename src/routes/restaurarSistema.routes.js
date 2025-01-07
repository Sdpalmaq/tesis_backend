import express from "express";
import { restaurarSistema } from "../controllers/restaurar_sistema.controller.js";
const router = express.Router();
// Ruta para restaurar el sistema de una placa ESP32
router.post("/:id_esp32/restaurar", restaurarSistema);

export default router;
