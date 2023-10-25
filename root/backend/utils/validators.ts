import { FieldInfo, NewBoard, NewUser } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (fieldName: string, value: unknown): string => {
  if (!isString(value)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};

const parseNumber = (fieldName: string, value: unknown): number => {
  if (!isNumber(value)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

const parseBoolean = (fieldName: string, value: unknown): boolean => {
  if (!isBoolean(value)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${value}`);
  }
  return value;
};

const ensureIsObject = (object: unknown): object is Record<string, unknown> => {
  if (!object || typeof object !== "object" || Array.isArray(object)) {
    throw new Error("Provided data is not an object");
  }
  return true;
};

const parseFields = (
  object: Record<string, unknown>,
  fields: FieldInfo[]
): Record<string, unknown> => {
  return fields.reduce((acc, fieldInfo) => {
    const value = object[fieldInfo.name];
    if (!(fieldInfo.name in object)) {
      throw new Error(`Field missing: ${fieldInfo.name}`);
    }

    switch (fieldInfo.type) {
      case "string":
        acc[fieldInfo.name] = parseString(fieldInfo.name, value);
        break;
      case "number":
        acc[fieldInfo.name] = parseNumber(fieldInfo.name, value);
        break;
      case "boolean":
        acc[fieldInfo.name] = parseBoolean(fieldInfo.name, value);
        break;
      default:
        throw new Error(`Unknown field type for ${fieldInfo.name}`);
    }

    return acc;
  }, {} as Record<string, unknown>);
};

export const toNewUser = (object: unknown): NewUser => {
  if (!ensureIsObject(object)) {
    throw new Error("Object validation failed");
  }
  const requiredFields: FieldInfo[] = [
    { name: "username", type: "string" },
    { name: "name", type: "string" },
    { name: "password", type: "string" },
  ];
  const parsedFields = parseFields(object, requiredFields);

  return {
    username: parsedFields.username as string,
    name: parsedFields.name as string,
    password: parsedFields.password as string,
  };
};

export const toLoginUser = (object: unknown): NewUser => {
  if (!ensureIsObject(object)) {
    throw new Error("Object validation failed");
  }

  const requiredFields: FieldInfo[] = [
    { name: "username", type: "string" },
    { name: "password", type: "string" },
  ];
  const parsedFields = parseFields(object, requiredFields);
  return {
    username: parsedFields.username as string,
    password: parsedFields.password as string,
  };
};

export const toNewBoard = (object: unknown): NewBoard => {
  if (!ensureIsObject(object)) {
    throw new Error("Object validation failed");
  }
  const requiredFields: FieldInfo[] = [{ name: "name", type: "string" }];
  const parsedFields = parseFields(object, requiredFields);
  return {
    name: parsedFields.name as string,
  };
};
