import { Router } from "express";
import {
  createHuella,
  getHuellas,
  deleteHuella,
} from "../controllers/huellas_dactilares.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { createHuellaValidator } from "../validators/huellasDactilares.validator.js";

const router = Router();

router.post(
  "/",
  [verifyToken, isAdmin, createHuellaValidator, validateRequest],
  createHuella
);

router.get("/", verifyToken, getHuellas);

router.delete("/:id", [verifyToken, isAdmin], deleteHuella);

export default router;
