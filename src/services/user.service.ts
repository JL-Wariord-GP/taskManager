//! src/services/user.service.ts

import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";

/**
 * Creates a new user and hashes their password before saving.
 * @param userData - The data for the new user.
 * @returns The saved user object.
 */
const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const saltRounds = 10;
  // Encrypt the password before saving the user
  const hashedPassword = await bcrypt.hash(
    userData.password as string,
    saltRounds
  );
  const user = new User({
    ...userData,
    password: hashedPassword,
  });
  return await user.save(); // Save the new user
};

/**
 * Finds a user by email.
 * @param email - The email of the user to find.
 * @returns The user object or null if not found.
 */
const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export default {
  createUser,
  findByEmail,
};
