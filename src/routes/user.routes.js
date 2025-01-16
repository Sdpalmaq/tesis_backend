import { Router } from "express";
import {
  createUser,
  getUsers,
  updatePassword,
  deleteUser,
  updateUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createUserValidator,
  updateUserValidator,
  updatePasswordValidator,
} from "../validators/user.validator.js";

const router = Router();

router.post("/", [verifyToken, isAdmin, validateRequest], createUser);

router.get("/", getUsers);

router.put(
  "/:cedula",
  [verifyToken, isAdmin, updateUserValidator, validateRequest],
  updateUser
);

router.patch(
  "/:cedula/password",
  [updatePasswordValidator, validateRequest],
  updatePassword
);

router.delete("/:cedula", [verifyToken, isAdmin], deleteUser);

router.post("/password-reset", requestPasswordReset); //solicitar enlace
router.post("/reset-password", resetPassword); //resetear contraseña

export default router;
