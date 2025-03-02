import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  user: IUser;
  token: string;
}

const loginUser = async ({
  email,
  password,
}: LoginInput): Promise<LoginResponse> => {
  // Se busca el usuario por correo electrónico
  const user = await User.findOne({ email });
  if (!user) {
    // Lanza un error si no se encuentra el usuario
    throw new Error("User not found");
  }

  // Comparar la contraseña proporcionada con la almacenada (encriptada)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Lanza un error si las contraseñas no coinciden
    throw new Error("Invalid credentials");
  }

  // Generar un token JWT
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "defaultSecret", 
    { expiresIn: "1h" }
  );

  // Retorna el usuario y el token
  return { user, token };
};

export default {
  loginUser,
};
