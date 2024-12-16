import { check } from "express-validator";

export const createUserValidator = [
  check("cedula")
    .isLength({ min: 10, max: 10 })
    .withMessage("La cédula debe tener 10 dígitos")
    .matches(/^[0-9]+$/)
    .withMessage("La cédula solo debe contener números"),

  check("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder los 100 caracteres"),

  check("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ max: 100 })
    .withMessage("El apellido no puede exceder los 100 caracteres"),

  check("correo")
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un correo válido")
    .normalizeEmail(),

  check("telefono")
    .matches(/^[0-9]{10}$/)
    .withMessage("El teléfono debe tener 10 dígitos numéricos"),

  check("contrasena")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const updateUserValidator = [
  check("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder los 100 caracteres"),

  check("apellido")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("El apellido no puede exceder los 100 caracteres"),

  check("correo")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Debe proporcionar un correo válido")
    .normalizeEmail(),

  check("telefono")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("El teléfono debe tener 10 dígitos numéricos"),

  check("es_administrador")
    .optional()
    .isBoolean()
    .withMessage("es_administrador debe ser un valor booleano"),
];

export const updatePasswordValidator = [
  check("nuevaContrasena")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
