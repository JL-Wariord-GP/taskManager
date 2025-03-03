import mongoose from "mongoose";
import Task, { ITask } from "../models/task.model";

const createTask = async (
  taskData: Partial<ITask>,
  authenticatedUserId?: string
): Promise<ITask> => {
  if (authenticatedUserId) {
    // Convertimos el string a ObjectId
    taskData.user = new mongoose.Types.ObjectId(authenticatedUserId);
  }
  const task = new Task(taskData);
  return await task.save();
};

const updateTask = async (
  taskId: string | mongoose.Types.ObjectId,
  updateData: Partial<ITask>,
  authenticatedUserId?: string
): Promise<ITask | null> => {
  if (authenticatedUserId) {
    updateData.user = new mongoose.Types.ObjectId(authenticatedUserId);
  }
  return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
};

const deleteTask = async (
  taskId: mongoose.Types.ObjectId | string
): Promise<ITask | null> => {
  return await Task.findByIdAndDelete(taskId);
};

export default {
  createTask,
  updateTask,
  deleteTask,
};
