import { NewUser } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (name: string, text: unknown): string => {
  if (!isString(text)) {
    throw new Error(`Incorrect or missing ${name}: ${text}`);
  }
  return text;
};

export const toNewUser = (object: unknown): NewUser => {
  if (!object || typeof object !== "object" || Array.isArray(object)) {
    throw new Error("Incorrect or missing data");
  }

  if ("username" in object && "name" in object && "password" in object) {
    const newUser: NewUser = {
      username: parseString("username", object.username),
      name: parseString("name", object.name),
      password: parseString("password", object.password),
    };
    return newUser;
  }

  throw new Error("Incorrect data: a field missing");
};

export const toLoginUser = (object: unknown): NewUser => {
  if (!object || typeof object !== "object" || Array.isArray(object)) {
    throw new Error("Incorrect or missing data");
  }

  if ("username" in object && "password" in object) {
    const newUser: NewUser = {
      username: parseString("username", object.username),
      password: parseString("password", object.password),
    };
    return newUser;
  }

  throw new Error("Incorrect data: a field missing");
};
