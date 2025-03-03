import { Request, Response, NextFunction } from "express";
import taskService from "../services/task.service";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedUserId = req.userId as string;
    const taskData = req.body;
    const newTask = await taskService.createTask(taskData, authenticatedUserId);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const authenticatedUserId = (req as any).userId as string;
    const updateData = req.body;
    const updatedTask = await taskService.updateTask(
      id,
      updateData,
      authenticatedUserId
    );
    if (!updatedTask) {
        res
        .status(404)
        .json({ message: "Task not found" });
      return;
    }
      res.status(200).json({message: "Task update successfully", task: updatedTask});
  } catch (error) {
    next(error);
  }
};

