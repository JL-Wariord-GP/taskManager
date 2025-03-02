import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";

const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const saltRounds = 10;
  //! Encriptamos la contraseña antes de guardar el usuario
  const hashedPassword = await bcrypt.hash(
    userData.password as string,
    saltRounds
  );
  const user = new User({
    ...userData,
    password: hashedPassword,
  });
  return await user.save();
};

export default {
  createUser,
};
