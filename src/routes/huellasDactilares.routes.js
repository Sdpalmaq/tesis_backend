import express from "express";
import {
  registrarHuella,
  eliminarHuella,
  getHuellasByVehiculo
} from "../controllers/huellas_dactilares.controller.js";

const router = express.Router();

// Registrar huella
router.post("/registrar", registrarHuella);

// Eliminar huella específica
router.delete("/eliminar/:id_esp32/:id_huella", eliminarHuella);

// Obtener huellas de un vehículo
router.get("/get-huellas/:id_vehiculo", getHuellasByVehiculo);

// Reiniciar huellas en una placa
//router.delete("/reset/:id_esp32", resetHuellas);

export default router;
