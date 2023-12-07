// Enums
export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  None = "None",
}

export enum Role {
  Owner = "Owner",
  Editor = "Editor",
  Visitor = "Visitor",
}

export function isRole(value: string): value is Role {
  return Object.values(Role).includes(value as Role);
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  limit: number;
}

// User-related interfaces

export interface User {
  _id: string;
  username: string;
  name: string;
}

export interface UserFromGet {
  id: string;
  username: string;
  name: string;
}

export interface UserBoard {
  boardId: Board;
  role: Role;
  _id: string;
}

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

export interface PopulatedCollaborator {
  userId: User;
  role: Role;
}

export interface Board {
  _id: string;
  name: string;
  collaborators: PopulatedCollaborator[];
}

export interface NewBoard {
  name: string;
  collaborators?: Collaborator[];
}

// Task-related interfaces
export interface Task {
  id: string;
  board: string;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  createdBy: string;
}

export interface TasksWithPagination {
  pagination: Pagination;
  data: Task[];
}

export interface NewTask {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}
