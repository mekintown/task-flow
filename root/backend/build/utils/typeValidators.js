"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLoginUser = exports.toNewUser = void 0;
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const parseString = (name, text) => {
    if (!isString(text)) {
        throw new Error(`Incorrect or missing ${name}: ${text}`);
    }
    return text;
};
const toNewUser = (object) => {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
        throw new Error("Incorrect or missing data");
    }
    if ("username" in object && "name" in object && "password" in object) {
        const newUser = {
            username: parseString("username", object.username),
            name: parseString("name", object.name),
            password: parseString("password", object.password),
        };
        return newUser;
    }
    throw new Error("Incorrect data: a field missing");
};
exports.toNewUser = toNewUser;
const toLoginUser = (object) => {
    if (!object || typeof object !== "object" || Array.isArray(object)) {
        throw new Error("Incorrect or missing data");
    }
    if ("username" in object && "password" in object) {
        const newUser = {
            username: parseString("username", object.username),
            password: parseString("password", object.password),
        };
        return newUser;
    }
    throw new Error("Incorrect data: a field missing");
};
exports.toLoginUser = toLoginUser;
