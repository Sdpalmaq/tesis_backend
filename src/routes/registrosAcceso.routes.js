import { Router } from "express";
import {
  createRegistroAcceso,
  getRegistrosAcceso,
} from "../controllers/registro_acceso.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { createRegistroAccesoValidator } from "../validators/registroAcceso.validator.js";

const router = Router();

router.post(
  "/",
  [verifyToken, createRegistroAccesoValidator, validateRequest],
  createRegistroAcceso
);

router.get("/", [verifyToken, isAdmin], getRegistrosAcceso);

export default router;
