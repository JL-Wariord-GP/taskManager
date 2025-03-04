//! src/services/auth.service.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { IUser } from "../models/user.model";
import User from "../models/user.model";

/**
 * Hashes a user's password using bcrypt.
 * @param password - Plaintext password to hash.
 * @returns Hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt); 
};

/**
 * Compares a plaintext password with a hashed password.
 * @param password - Plaintext password to compare.
 * @param hash - Hashed password to compare with.
 * @returns Boolean indicating if the passwords match.
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generates a JWT token for the authenticated user.
 * @param user - User object to generate token for.
 * @returns JWT token.
 */
export const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, {
    expiresIn: "1h",
  });
};

/**
 * Authenticates a user by email and password and returns a JWT token.
 * @param email - User email.
 * @param password - User password.
 * @returns Object containing JWT token and user information.
 */
export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ token: string; user: IUser }> => {
  const user = await User.findOne({ email }); 
  if (!user) {
    throw new Error("User not found");
  }
  const isValid = await comparePassword(password, user.password); 
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken(user);
  return { token, user };
};
