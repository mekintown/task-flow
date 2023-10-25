import mongoose, { Document, Schema } from "mongoose";
import { Task } from "../types";

const TaskPriority = Object.freeze({
  Low: "Low",
  Medium: "Medium",
  High: "High",
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    required: true,
    enum: Object.values(TaskPriority),
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

Object.assign(taskSchema.statics, {
  TaskPriority,
});

taskSchema.set("toJSON", {
  transform: (_document: Document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;