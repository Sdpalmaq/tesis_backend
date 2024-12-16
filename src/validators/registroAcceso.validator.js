import { check } from "express-validator";

export const createRegistroAccesoValidator = [
  check("usuario_cedula")
    .isLength({ min: 10, max: 10 })
    .withMessage("La cédula debe tener 10 dígitos")
    .matches(/^[0-9]+$/)
    .withMessage("La cédula solo debe contener números"),

  check("vehiculo_id")
    .isInt()
    .withMessage("El ID del vehículo debe ser un número entero"),

  check("fecha_acceso")
    .optional()
    .isISO8601()
    .withMessage(
      "La fecha de acceso debe estar en formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"
    ),
];
