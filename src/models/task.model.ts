//! src/models/task.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  user: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
