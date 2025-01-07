import express from "express";
import { forzarArranque } from "../controllers/arranque_forzoso.controller.js";

const router = express.Router();

// Ruta para enviar el comando de arranque forzoso
router.post("/forzar", forzarArranque);

export default router;
