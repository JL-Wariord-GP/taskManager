import { RequestHandler } from "express";
import { validationResult } from "express-validator";


export const validationError: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((error) => ({
      message: error.msg,
    }));
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Se encontraron errores de validación.",
      errors: errorDetails,
    });
    return;
  }
  next();
};
