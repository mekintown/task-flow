import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { User } from "../types";
import Board from "./board";
import boardCollaborator from "./boardCollaboration";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (_document: Document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const boards = await Board.find({ owner: this._id });
    for (const board of boards) {
      await board.deleteOne();
    }

    await boardCollaborator.deleteMany({ user: this._id });

    next();
  }
);

const User = mongoose.model<User>("User", userSchema);

export default User;
