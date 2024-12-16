import { check } from "express-validator";

export const createVehiculoValidator = [
  check("placa")
    .isLength({ min: 6, max: 7 })
    .withMessage("La placa debe tener entre 6 y 7 caracteres")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("La placa solo debe contener letras mayúsculas y números"),

  check("marca")
    .trim()
    .notEmpty()
    .withMessage("La marca es requerida")
    .isLength({ max: 50 })
    .withMessage("La marca no puede exceder los 50 caracteres"),

  check("modelo")
    .trim()
    .notEmpty()
    .withMessage("El modelo es requerido")
    .isLength({ max: 50 })
    .withMessage("El modelo no puede exceder los 50 caracteres"),

  check("anio")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`El año debe estar entre 1900 y ${new Date().getFullYear()}`),
];

export const updateVehiculoValidator = [
  check("placa")
    .optional()
    .isLength({ min: 6, max: 7 })
    .withMessage("La placa debe tener entre 6 y 7 caracteres")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("La placa solo debe contener letras mayúsculas y números"),

  check("marca")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La marca no puede estar vacía")
    .isLength({ max: 50 })
    .withMessage("La marca no puede exceder los 50 caracteres"),

  check("modelo")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El modelo no puede estar vacío")
    .isLength({ max: 50 })
    .withMessage("El modelo no puede exceder los 50 caracteres"),

  check("anio")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`El año debe estar entre 1900 y ${new Date().getFullYear()}`),
];
