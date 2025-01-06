import { check } from "express-validator";

export const createHuellaValidator = [
  check("usuario_cedula")
    .isLength({ min: 10, max: 10 })
    .withMessage("La cédula debe tener 10 dígitos")
    .matches(/^[0-9]+$/)
    .withMessage("La cédula solo debe contener números"),

  check("id_huella")
    .notEmpty()
    .withMessage("La huella es requerida"),
];
