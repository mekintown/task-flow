import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { Board } from "../types";
import Task from "./task";
import boardCollaborator from "./boardCollaborator";

const boardSchema = new Schema<Board>(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

boardSchema.plugin(uniqueValidator);

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
    this.deletedAt = new Date();
    await this.save();

    await Task.deleteMany({ board: this._id });
    await boardCollaborator.deleteMany({ board: this._id });

    next();
  }
);

const Board = mongoose.model<Board>("Board", boardSchema);

export default Board;
