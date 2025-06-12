import { Router } from "express";
import {
  createVehiculo,
  getVehiculos,
  updateVehiculo,
  deleteVehiculo,
  getPendingVehiculos,
  validateVehiculo,
  associateESP32,
  getVehiculosByPropietario,
} from "../controllers/vehiculos.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createVehiculoValidator,
  updateVehiculoValidator,
} from "../validators/vehiculos.validator.js";

const router = Router();

router.post(
  "/",
  [ createVehiculoValidator,validateRequest],
  createVehiculo
);

// Ruta para asociar una ESP32 a un vehículo
router.post("/asociar-esp32", associateESP32);

router.get("/",  getVehiculos);
 
router.put(
  "/:id",
  [updateVehiculoValidator, validateRequest],
  updateVehiculo
);

router.delete("/:id", deleteVehiculo);

router.get("/pending",  getPendingVehiculos);

router.patch("/:id/validate", validateVehiculo);

router.get("/:propietario_cedula", getVehiculosByPropietario);

export default router;
