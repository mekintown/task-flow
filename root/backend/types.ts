import { Schema } from "mongoose";

export interface User extends Document {
  id: string;
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
