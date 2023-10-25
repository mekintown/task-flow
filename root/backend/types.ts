import { Request } from "express";
import { ObjectId, Schema } from "mongoose";

export interface User extends Document {
  id: ObjectId;
  username: string;
  name?: string;
  passwordHash: string;
  boards: Schema.Types.ObjectId[];
}

export type NonSensitiveUser = Omit<User, "passwordHash">;
export interface NewUser {
  username: string;
  name?: string;
  password: string;
}

export interface Board extends Document {
  id: ObjectId;
  name?: string;
  owner: ObjectId;
  tasks: Schema.Types.ObjectId[];
  collaborators: Schema.Types.ObjectId[];
}

export interface NewBoard {
  name: string;
}

export interface RequestWithToken extends Request {
  token?: string;
}

export interface Task {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  dueDate: Date;
  id?: string;
}
