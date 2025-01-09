import { Router } from "express";
import { configureWiFi } from "../controllers/wifi.controller.js";

const router = Router();

// Rutas para configuración Wi-Fi
router.post("/configure/:id_esp32", configureWiFi);

export default router;
