import jwt, { SignOptions } from "jsonwebtoken";

export const signToken = (
  payload: object,
  expiresIn: number | string = "1h"
): string => {
  const secret: string = process.env.JWT_SECRET || "defaultSecret";
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): any => {
  const secret: string = process.env.JWT_SECRET || "defaultSecret";
  return jwt.verify(token, secret);
};
