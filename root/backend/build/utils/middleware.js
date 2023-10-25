"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerExtractor = exports.asyncMiddleware = void 0;
const logger_1 = __importDefault(require("./logger"));
const board_1 = __importDefault(require("../models/board"));
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
const tokenExtractor = (request, _response, next) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
    }
    next();
};
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
const ownerExtractor = (request, _response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const board = yield board_1.default.findById(request.params.id);
    if (board) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        request.owner = board.owner.toString();
    }
    next();
});
exports.ownerExtractor = ownerExtractor;
exports.default = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    asyncMiddleware: exports.asyncMiddleware,
    ownerExtractor: exports.ownerExtractor,
};
