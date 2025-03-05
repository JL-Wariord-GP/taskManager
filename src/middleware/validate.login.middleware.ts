//! src/middleware/validate.login.middleware.ts

import { check } from "express-validator";

export const validateLogin = [
  check("email").isEmail().withMessage("A valid email address is required."),
  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters."),
];
