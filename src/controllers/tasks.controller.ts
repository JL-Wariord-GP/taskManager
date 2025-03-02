import { Request, Response, NextFunction } from "express";
import taskService from "../services/task.service";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const taskData = req.body;
    const newTask = await taskService.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};
