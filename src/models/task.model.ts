import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId; 
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
