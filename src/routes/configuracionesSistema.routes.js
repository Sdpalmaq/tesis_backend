import { Router } from "express";
import {
  upsertConfiguracion,
  getConfiguraciones,
} from "../controllers/configuraciones_sistema.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { upsertConfiguracionValidator } from "../validators/configuracionesSistema.validator.js";

const router = Router();

router.post(
  "/",
  [verifyToken, isAdmin, upsertConfiguracionValidator, validateRequest],
  upsertConfiguracion
);

router.get("/", verifyToken, getConfiguraciones);

export default router;
