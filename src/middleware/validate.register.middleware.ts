//! src/middleware/validate.register.middleware.ts

import { check } from "express-validator";

export const validateRegister = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .withMessage("Name can only contain letters.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters."),
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("A valid email address is required.")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters.")
    .custom((value: string) => {
      if (!/[A-Z]/.test(value)) {
        throw new Error("Password must contain uppercase letters.");
      }
      return true;
    })
    .custom((value: string) => {
      if (!/[a-z]/.test(value)) {
        throw new Error("Password must contain lowercase letters.");
      }
      return true;
    })
    .custom((value: string) => {
      if (!/\d/.test(value)) {
        throw new Error("Password must contain numbers.");
      }
      return true;
    })
    .custom((value: string) => {
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        throw new Error("Password must contain a special character.");
      }
      return true;
    }),
];
