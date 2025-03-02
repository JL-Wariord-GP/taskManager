import User, { IUser } from "../models/user.model";

const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

export default {
  createUser,
};
