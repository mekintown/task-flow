import { Request } from "express";
import { Document, ObjectId } from "mongoose";

// Enums
export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

// User-related interfaces
export interface User extends Document {
  _id: ObjectId;
  id: string;
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

// Board-related interfaces
export interface Board extends Document {
  _id: ObjectId;
  id: string;
  name?: string;
  owner: ObjectId;
  deletedAt: Date | null;
}

export interface NewBoard {
  name: string;
}

export interface BoardCollaborator {
  id: string;
  board: ObjectId;
  user: ObjectId;
  dateJoined: Date;
}

// Task-related interfaces
export interface Task extends Document {
  _id: ObjectId;
  id: string;
  board: ObjectId;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  createdBy: ObjectId;
}

export interface NewTask {
  board: ObjectId;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  createdBy: ObjectId;
}

// Request-related interfaces
export interface RequestWithToken extends Request {
  token?: string;
}

export interface AuthorizedRequest extends RequestWithToken {
  userId?: string;
}

export interface OwnerExtractedRequest extends AuthorizedRequest {
  owner?: string;
}

// Miscellaneous
export interface FieldInfo {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "Priority" | "ObjectId";
}
