import mongoose, { Document, Schema } from "mongoose";
import { BoardCollaborator } from "../types";

const BoardCollaboratorSchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

BoardCollaboratorSchema.set("toJSON", {
  transform: (_document: Document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const collaborateWith = mongoose.model<BoardCollaborator>(
  "BoardCollaborator",
  BoardCollaboratorSchema
);

export default collaborateWith;
