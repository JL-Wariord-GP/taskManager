//! src/services/task.service.ts

import Task, { ITask } from "../models/task.model";

/**
 * Creates a new task and assigns it to the authenticated user.
 * @param taskData - The data for the new task.
 * @param userId - The ID of the user creating the task.
 * @returns The saved task object.
 */
const createTask = async (
  taskData: Partial<ITask>,
  userId: string
): Promise<ITask> => {
  const newTask = new Task({ ...taskData, user: userId });
  return await newTask.save();
};

/**
 * Updates an existing task.
 * @param taskId - The ID of the task to update.
 * @param updateData - The data to update in the task.
 * @param userId - The ID of the authenticated user.
 * @returns The updated task or null if not found.
 */
const updateTask = async (
  taskId: string,
  updateData: Partial<ITask>,
  userId: string
): Promise<ITask | null> => {
  return await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

/**
 * Deletes a task if it belongs to the authenticated user.
 * @param taskId - The ID of the task to delete.
 * @param userId - The ID of the authenticated user.
 * @returns The deleted task or null if not found.
 */
const deleteTask = async (
  taskId: string,
  userId: string
): Promise<ITask | null> => {
  return await Task.findOneAndDelete({ _id: taskId, user: userId });
};

/**
 * Retrieves a task by its ID for the authenticated user.
 * @param taskId - The ID of the task to retrieve.
 * @param userId - The ID of the authenticated user.
 * @returns The task or null if not found.
 */
const getTaskById = async (
  taskId: string,
  userId: string
): Promise<ITask | null> => {
  return await Task.findOne({ _id: taskId, user: userId });
};

/**
 * Retrieves all tasks for the authenticated user.
 * @param userId - The ID of the authenticated user.
 * @returns An array of tasks belonging to the user.
 */
const getTasksByUser = async (userId: string): Promise<ITask[]> => {
  return await Task.find({ user: userId });
};

export default {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasksByUser,
};
