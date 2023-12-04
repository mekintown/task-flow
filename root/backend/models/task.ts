import mongoose, { Document, Schema } from "mongoose";
import { Priority, Task } from "../types";

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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

Object.assign(taskSchema.statics, {
  Priority,
});

taskSchema.set("toJSON", {
  transform: (_document: Document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// taskSchema.index({ board: 1 });

const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
