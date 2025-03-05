//! src/middleware/error.handler.middleware.ts

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error";

/**
 * Global error handling middleware.
 * Captures errors thrown in the application and sends a formatted response.
 *
 * @param err - The error object thrown.
 * @param _ - The Express request object (unused).
 * @param res - The Express response object.
 * @param __ - The next middleware function (unused).
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  __: NextFunction
): void => {
  // Log the error stack trace for debugging purposes
  console.error("Error stack:", err.stack);

  // Determine the appropriate status code. If the error is an instance of AppError,
  // use its statusCode; otherwise, default to 500 (Internal Server Error)
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Send the error response in JSON format
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};
