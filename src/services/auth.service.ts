// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { IUser } from "../models/user.model";
import User from "../models/user.model";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, {
    expiresIn: "1h",
  });
};

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
