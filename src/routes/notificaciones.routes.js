import { Router } from "express";
import { enviarNotificacion } from "../controllers/notificaciones.controller.js";

const router = Router();

router.post("/enviar", enviarNotificacion);



export default router;
