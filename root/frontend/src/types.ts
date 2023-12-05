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
  boardId: string;
  role: Role;
}

export interface User {
  _id: string;
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
  userId: string;
  role: Role;
}

export interface Board {
  _id: string;
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
export interface Task {
  _id: string;
  id: string;
  board: string;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  createdBy: string;
}

export interface NewTask {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}
