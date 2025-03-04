//! src/controllers/taskController.ts

import { Response, NextFunction } from "express";
import taskService from "../services/task.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

/**
 * Creates a new task for the authenticated user.
 * @param req - The request object, which contains user data and task data.
 * @param res - The response object, used to send back the created task.
 * @param next - The next function to handle errors.
 */
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id; 
    const taskData = req.body; 
    const newTask = await taskService.createTask(taskData, userId);
    res.status(201).json(newTask);
  } catch (error) {
    next(error); 
  }
};

/**
 * Updates an existing task.
 * @param req - The request object containing the task ID and updated data.
 * @param res - The response object, used to send back the updated task.
 * @param next - The next function to handle errors.
 */
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; 
    const userId = req.user!.id;
    const updateData = req.body; 
    const updatedTask = await taskService.updateTask(id, updateData, userId);
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found or not authorized" });
      return;
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    next(error); 
  }
};

/**
 * Deletes a task for the authenticated user.
 * @param req - The request object containing the task ID to delete.
 * @param res - The response object, used to send back the deletion confirmation.
 * @param next - The next function to handle errors.
 */
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; 
    const userId = req.user!.id;
    const deletedTask = await taskService.deleteTask(id, userId);
    if (!deletedTask) {
      res.status(404).json({ message: "Task not found or not authorized" });
      return;
    }
    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    next(error); 
  }
};

/**
 * Retrieves a specific task for the authenticated user.
 * @param req - The request object containing the task ID.
 * @param res - The response object, used to send back the task data.
 * @param next - The next function to handle errors.
 */
export const getTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; 
    const userId = req.user!.id;
    const task = await taskService.getTaskById(id, userId);
    if (!task) {
      res.status(404).json({ message: "Task not found or not authorized" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all tasks for the authenticated user.
 * @param req - The request object.
 * @param res - The response object, used to send back all tasks.
 * @param next - The next function to handle errors.
 */
export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const tasks = await taskService.getTasksByUser(userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
