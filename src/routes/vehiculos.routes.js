import { Router } from "express";
import {
  createVehiculo,
  getVehiculos,
  updateVehiculo,
  deleteVehiculo,
  getPendingVehiculos,
  validateVehiculo,
  associateESP32,
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
  [verifyToken, createVehiculoValidator, validateRequest],
  createVehiculo
);

// Ruta para asociar una ESP32 a un vehículo
router.post("/asociar-esp32", associateESP32);

router.get("/", verifyToken, getVehiculos);

router.put(
  "/:id",
  [verifyToken, isAdmin, updateVehiculoValidator, validateRequest],
  updateVehiculo
);

router.delete("/:id", [verifyToken, isAdmin], deleteVehiculo);

router.get("/pending", [verifyToken, isAdmin], getPendingVehiculos);

router.patch("/:id/validate", [verifyToken, isAdmin], validateVehiculo);

export default router;
