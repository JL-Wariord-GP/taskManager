import { check } from "express-validator";

export const validateRegister = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Debe ingresar su nombre.")
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .withMessage("El nombre solo puede contener letras.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres."),
  check("email")
    .notEmpty()
    .withMessage("Debe ingresar un correo.")
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido.")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("Debe ingresar una contraseña.")
    .isLength({ min: 8, max: 16 })
    .withMessage("La contraseña debe tener entre 8 y 16 caracteres.")
    .custom((value: string) => {
      if (!/[A-Z]/.test(value)) {
        throw new Error("La contraseña debe contener mayúsculas.");
      }
      return true;
    })
    .custom((value: string) => {
      if (!/[a-z]/.test(value)) {
        throw new Error("La contraseña debe contener minúsculas.");
      }
      return true;
    })
    .custom((value: string) => {
      if (!/\d/.test(value)) {
        throw new Error("La contraseña debe contener números.");
      }
      return true;
    })
    .custom((value: string) => {
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        throw new Error("La contraseña debe contener un carácter especial.");
      }
      return true;
    }),
];
