import { Request } from "express";
import { ObjectId } from "mongoose";

export interface User extends Document {
  id: ObjectId;
  username: string;
  name: string;
  passwordHash: string;
  deletedAt: Date | null;
}

export type NonSensitiveUser = Omit<User, "passwordHash">;
export interface NewUser {
  username: string;
  name: string;
  password: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface Board extends Document {
  id: ObjectId;
  name?: string;
  owner: ObjectId;
  deletedAt: Date | null;
}

export interface NewBoard {
  name: string;
}

export interface RequestWithToken extends Request {
  token?: string;
}

export interface OwnerExtractedRequest extends RequestWithToken {
  owner?: string;
}

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export interface Task extends Document {
  id: ObjectId;
  board: ObjectId;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
}

export interface NewTask {
  board: ObjectId;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
}

export interface BoardCollaborator {
  id: ObjectId;
  board: ObjectId;
  user: ObjectId;
  dateJoined: Date;
}

export interface FieldInfo {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "priority" | "objectId";
}
