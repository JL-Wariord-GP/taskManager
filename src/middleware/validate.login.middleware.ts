import { check } from "express-validator";

export const validateLogin = [
  check("email")
    .isEmail()
    .withMessage("Debe ingresar un correo electrónico válido."),
  check("password").notEmpty().withMessage("La contraseña es obligatoria."),
  check("password")
    .notEmpty()
    .withMessage("Debe ingresar una contraseña.")
    .isLength({ min: 8, max: 16 })
    .withMessage("La contraseña debe tener entre 8 y 16 caracteres."),
];
