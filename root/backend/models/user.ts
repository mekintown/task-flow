import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { User } from "../types";
import Task from "./task";
import Board from "./board";

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
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
    // Delete tasks created by the user
    await Task.deleteMany({ createdBy: this._id });

    // Optionally, remove the user from any boards they are collaborators of
    await Board.updateMany(
      {},
      { $pull: { collaborators: { userId: this._id } } }
    );

    next();
  }
);

const User = mongoose.model<User>("User", userSchema);

export default User;
