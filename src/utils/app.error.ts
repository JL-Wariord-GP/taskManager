//! src/utils/app.error.ts
/**
 * Custom application error class.
 * Extends the base Error class to include an HTTP status code.
 */
export class AppError extends Error {
  public statusCode: number;

  /**
   * Creates an instance of AppError.
   *
   * @param message - The error message.
   * @param statusCode - The HTTP status code to return.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Capture the stack trace (excluding the constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}
