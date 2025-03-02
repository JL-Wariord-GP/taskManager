import { Request, Response } from "express";
import userService from "../services/user.service";
import authService from "../services/auth.service";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const newUser = await userService.createUser({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error register user", error);
    res.status(500).json({
      message: "Error creating user",
    });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json(result);
  } catch (error) {
    console.error("Invalid credentials", error);
    res.status(500).json({
      message: "Invalid credentials",
    });
  }
};

export default {
  register,
  login,
};
