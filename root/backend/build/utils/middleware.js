"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMiddleware = void 0;
const logger_1 = __importDefault(require("./logger"));
const requestLogger = (request, _response, next) => {
    logger_1.default.info("Method:", request.method);
    logger_1.default.info("Path:  ", request.path);
    logger_1.default.info("Body:  ", request.body);
    logger_1.default.info("---");
    next();
};
const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncMiddleware = asyncMiddleware;
const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (error, _request, response, next) => {
    logger_1.default.error(error.message);
    if (error.name === "CastError") {
        response.status(400).send({ error: "malformatted id" });
    }
    else if (error.name === "ValidationError") {
        response.status(400).json({ error: error.message });
    }
    else if (error.name === "JsonWebTokenError") {
        response.status(400).json({ error: error.message });
    }
    else {
        next(error);
    }
};
exports.default = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
};
