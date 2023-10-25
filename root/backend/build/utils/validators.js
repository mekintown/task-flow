"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewBoard = exports.toLoginUser = exports.toNewUser = void 0;
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const parseString = (fieldName, value) => {
    if (!isString(value)) {
        throw new Error(`Incorrect or missing ${fieldName}: ${value}`);
    }
    return value;
};
const isNumber = (value) => {
    return typeof value === "number";
};
const parseNumber = (fieldName, value) => {
    if (!isNumber(value)) {
        throw new Error(`Incorrect or missing ${fieldName}: ${value}`);
    }
    return value;
};
const isBoolean = (value) => {
    return typeof value === "boolean";
};
const parseBoolean = (fieldName, value) => {
    if (!isBoolean(value)) {
        throw new Error(`Incorrect or missing ${fieldName}: ${value}`);
    }
    return value;
};
const ensureIsObject = (object) => {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
        throw new Error("Provided data is not an object");
    }
    return true;
};
const parseFields = (object, fields) => {
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
    }, {});
};
const toNewUser = (object) => {
    if (!ensureIsObject(object)) {
        throw new Error("Object validation failed");
    }
    const requiredFields = [
        { name: "username", type: "string" },
        { name: "name", type: "string" },
        { name: "password", type: "string" },
    ];
    const parsedFields = parseFields(object, requiredFields);
    return {
        username: parsedFields.username,
        name: parsedFields.name,
        password: parsedFields.password,
    };
};
exports.toNewUser = toNewUser;
const toLoginUser = (object) => {
    if (!ensureIsObject(object)) {
        throw new Error("Object validation failed");
    }
    const requiredFields = [
        { name: "username", type: "string" },
        { name: "password", type: "string" },
    ];
    const parsedFields = parseFields(object, requiredFields);
    return {
        username: parsedFields.username,
        password: parsedFields.password,
    };
};
exports.toLoginUser = toLoginUser;
const toNewBoard = (object) => {
    if (!ensureIsObject(object)) {
        throw new Error("Object validation failed");
    }
    const requiredFields = [{ name: "name", type: "string" }];
    const parsedFields = parseFields(object, requiredFields);
    return {
        name: parsedFields.name,
    };
};
exports.toNewBoard = toNewBoard;
