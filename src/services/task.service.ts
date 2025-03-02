import Task, { ITask } from "../models/task.model";

const createTask = async (taskData: Partial<ITask>): Promise<ITask> => {
  const task = new Task(taskData);
  return await task.save();
};

export default {
  createTask,
};
