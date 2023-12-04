import { ObjectId } from "mongoose";
import {
  Collaborator,
  LoginUser,
  NewBoard,
  NewTask,
  NewUser,
  Priority,
  Role,
} from "../types";
import ValidationError from "../errors/ValidationError";

export const ensureIsObject = (object: unknown): object is object => {
  if (!object || typeof object !== "object") {
    throw new ValidationError("Provided data is not an object");
  }
  return true;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

export const parseString = (fieldName: string, value: unknown): string => {
  if (!isString(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};

export const parseNumber = (fieldName: string, value: unknown): number => {
  if (!isNumber(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const parseBoolean = (fieldName: string, value: unknown): boolean => {
  if (!isBoolean(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const parseDate = (fieldName: string, value: unknown): string => {
  if (!isString(value) || !isDate(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isPriority = (param: string): param is Priority => {
  return Object.values(Priority)
    .map((v) => v.toString())
    .includes(param);
};

export const parsePriority = (fieldName: string, value: unknown): Priority => {
  if (!isString(value) || !isPriority(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isRole = (param: string): param is Role => {
  return Object.values(Role)
    .map((v) => v.toString())
    .includes(param);
};

export const parseRole = (fieldName: string, value: unknown): Role => {
  if (!isString(value) || !isRole(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

export const parseCollaborator = (object: object): Collaborator => {
  if ("userId" in object && "role" in object) {
    return {
      userId: parseObjectId("userId", object.userId),
      role: parseRole("role", object.role),
    };
  }

  throw new ValidationError("Incorrect data: a field missing");
};

export const parseCollaborators = (
  fieldName: string,
  array: unknown
): Collaborator[] => {
  if (!Array.isArray(array)) {
    throw new ValidationError(
      `Incorrect or missing ${fieldName}: expected an array`
    );
  }

  return array.map((object) => {
    if (ensureIsObject(object)) {
      return parseCollaborator(object);
    }
    throw new ValidationError("Incorrect data: a field missing");
  });
};

const isObjectId = (id: unknown): id is ObjectId => {
  if (typeof id !== "string") return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};

export const parseObjectId = (fieldName: string, value: unknown): ObjectId => {
  if (!isObjectId(value)) {
    throw new ValidationError(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

export const toNewUser = (object: unknown): NewUser => {
  if (!ensureIsObject(object)) {
    throw new ValidationError("Object validation failed");
  }

  if ("username" in object && "password" in object && "name" in object)
    return {
      username: parseString("username", object.username),
      name: parseString("name", object.name),
      password: parseString("password", object.password),
    };

  throw new ValidationError("Incorrect data: a field missing");
};

export const toLoginUser = (object: unknown): LoginUser => {
  if (!ensureIsObject(object)) {
    throw new ValidationError("Object validation failed");
  }

  if ("username" in object && "password" in object)
    return {
      username: parseString("username", object.username),
      password: parseString("password", object.password),
    };

  throw new ValidationError("Incorrect data: a field missing");
};

export const toNewTask = (object: unknown): NewTask => {
  if (!ensureIsObject(object)) {
    throw new ValidationError("Object validation failed");
  }

  if ("title" in object) {
    const newTask: NewTask = {
      title: parseString("title", object.title),
    };

    if ("description" in object) {
      newTask.description = parseString("description", object.description);
    }

    if ("dueDate" in object) {
      newTask.dueDate = parseDate("dueDate", object.dueDate);
    }

    if ("priority" in object) {
      newTask.priority = parsePriority("priority", object.priority);
    }

    return newTask;
  }

  throw new ValidationError("Incorrect data: a field missing");
};

export const toNewBoard = (object: unknown): NewBoard => {
  if (!ensureIsObject(object)) {
    throw new ValidationError("Object validation failed");
  }
  if ("name" in object) {
    const newBoard: NewBoard = {
      name: parseString("name", object.name),
    };
    if ("collaborators" in object) {
      newBoard.collaborators = parseCollaborators(
        "collaborators",
        object.collaborators
      );
    }
    return newBoard;
  }

  throw new ValidationError("Incorrect data: a field missing");
};
