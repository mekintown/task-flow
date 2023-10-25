import mongoose, { Document, Schema } from "mongoose";
import { Task } from "../types";
import { TASK_PRIORITY } from "../utils/constant";

const taskSchema = new Schema<Task>(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
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
      enum: Object.values(TASK_PRIORITY),
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

Object.assign(taskSchema.statics, {
  TASK_PRIORITY,
});

taskSchema.set("toJSON", {
  transform: (_document: Document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

taskSchema.index({ board: 1 });

const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
