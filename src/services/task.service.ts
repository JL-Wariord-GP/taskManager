import Task, { ITask } from "../models/task.model";

const createTask = async (
  taskData: Partial<ITask>,
  userId: string
): Promise<ITask> => {
  // Se asigna el usuario autenticado a la tarea, sobrescribiendo cualquier valor enviado
  const newTask = new Task({ ...taskData, user: userId });
  return await newTask.save();
};

const updateTask = async (
  taskId: string,
  updateData: Partial<ITask>,
  userId: string
): Promise<ITask | null> => {
  // Se utiliza $set para actualizar solo los campos enviados y se ejecutan las validaciones
  return await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

const deleteTask = async (
  taskId: string,
  userId: string
): Promise<ITask | null> => {
  // Elimina solo si la tarea pertenece al usuario autenticado
  return await Task.findOneAndDelete({ _id: taskId, user: userId });
};

const getTaskById = async (
  taskId: string,
  userId: string
): Promise<ITask | null> => {
  // Obtiene la tarea filtrando por su id y el usuario propietario
  return await Task.findOne({ _id: taskId, user: userId });
};

const getTasksByUser = async (userId: string): Promise<ITask[]> => {
  // Retorna solo las tareas que pertenecen al usuario autenticado
  return await Task.find({ user: userId });
};

export default {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasksByUser,
};
