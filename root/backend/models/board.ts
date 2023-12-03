import mongoose, { Document, Schema } from "mongoose";
import { Board, Role } from "../types";
import Task from "./task";
import User from "./user";

const boardSchema = new Schema<Board>(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    collaborators: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: Object.values(Role),
          required: true,
        },
      },
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

Object.assign(boardSchema.statics, {
  Role,
});

boardSchema.set("toJSON", {
  transform: (_document: Document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

boardSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await Task.deleteMany({ board: this._id });

    await User.updateMany({}, { $pull: { boards: { boardId: this._id } } });
    next();
  }
);

const Board = mongoose.model<Board>("Board", boardSchema);

export default Board;
