//! src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

/**
 * Middleware to protect routes using JWT.
 * Verifies that a valid token is provided in the Authorization header.
 */
export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1].trim();
  try {
    const decoded = verifyToken(token) as { id: string; role?: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
