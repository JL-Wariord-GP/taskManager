import { Request, Response } from "express";
import userService from "../services/user.service";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const newUser = await userService.createUser({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
          email: newUser.email
      },
    });
  } catch (error) {
      console.error('Error register user', error);
      res.status(500).json({
          message: 'Error creating user'
      })
  }
};

export default {
    register
};
