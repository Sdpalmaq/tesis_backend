import { check } from "express-validator";

export const upsertConfiguracionValidator = [
  check("clave")
    .trim()
    .notEmpty()
    .withMessage("La clave es requerida")
    .isLength({ max: 50 })
    .withMessage("La clave no puede exceder los 50 caracteres"),

  check("valor")
    .trim()
    .notEmpty()
    .withMessage("El valor es requerido")
    .isLength({ max: 100 })
    .withMessage("El valor no puede exceder los 100 caracteres"),

  check("descripcion")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder los 200 caracteres"),
];
