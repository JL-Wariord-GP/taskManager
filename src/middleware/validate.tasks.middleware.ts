
import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

/**
 * Middleware to validate the request body against a Joi schema.
 * @param schema Joi object schema.
 * @param customMessage Optional custom global error message.
 */
export const validate = (schema: ObjectSchema, customMessage?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => ({
        message: detail.message,
      }));
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: customMessage || "Validation errors were found.",
        errors,
      });
    } else {
      next();
    }
  };
};
