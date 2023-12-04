import { Request } from "express";
import { Document, ObjectId } from "mongoose";

// Enums
export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum Role {
  Owner = "Owner",
  Editor = "Editor",
  Visitor = "Visitor",
}

// User-related interfaces
export interface BoardCollaboration {
  boardId: ObjectId;
  role: Role;
}

export interface User extends Document {
  _id: ObjectId;
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  boards: BoardCollaboration[];
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
export interface Collaborator {
  userId: ObjectId;
  role: Role;
}

export interface Board extends Document {
  _id: ObjectId;
  id: string;
  name: string;
  collaborators: Collaborator[];
  tasks: Task[];
}

export interface NewBoard {
  name: string;
  collaborators?: Collaborator[];
}

// Task-related interfaces
export interface Task extends Document {
  _id: ObjectId;
  id: string;
  board: ObjectId;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  createdBy: ObjectId;
}

export interface NewTask {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

// Request-related interfaces

export interface ProtectRequest extends Request {
  user: User;
}

export interface AuthorizeRequest extends ProtectRequest {
  board: Board;
}

export interface OwnerExtractedRequest extends ProtectRequest {
  owner?: string;
}
