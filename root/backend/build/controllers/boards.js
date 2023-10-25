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
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
const board_1 = __importDefault(require("../models/board"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const validators_1 = require("../utils/validators");
const constant_1 = require("../utils/constant");
const boardRouter = express_1.default.Router();
boardRouter.post("/", (0, middleware_1.asyncMiddleware)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newBoard = (0, validators_1.toNewBoard)(request.body);
    if (!request.token) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "Token not provided in the request" });
        return;
    }
    const SECRET = process.env.SECRET;
    if (!SECRET) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "SECRET environment variable is not set" });
        return;
    }
    const decodedToken = jsonwebtoken_1.default.verify(request.token, SECRET);
    if (!decodedToken.id) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "token invalid" });
        return;
    }
    const user = yield user_1.default.findById(decodedToken.id);
    if (!user) {
        response
            .status(constant_1.HTTP_STATUS.BAD_REQUEST)
            .json({ error: "User not found" });
        return;
    }
    const board = new board_1.default(Object.assign(Object.assign({}, newBoard), { owner: user._id }));
    const savedBoard = yield board.save();
    yield user.save();
    const savedBoardPopulated = yield board_1.default.findById(savedBoard._id).populate("owner", {
        username: 1,
        name: 1,
    });
    response.status(constant_1.HTTP_STATUS.CREATED).json(savedBoardPopulated);
})));
boardRouter.get("/", (0, middleware_1.asyncMiddleware)((_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield board_1.default.find({}).populate("owner", {
        username: 1,
        name: 1,
    });
    response.json(boards);
})));
boardRouter.delete("/:id", (0, middleware_1.asyncMiddleware)(middleware_1.ownerExtractor), (0, middleware_1.asyncMiddleware)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jsonwebtoken_1.default.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "token invalid" });
        return;
    }
    if (request.owner !== decodedToken.id) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "invalid user" });
        return;
    }
    yield board_1.default.findByIdAndRemove(request.params.id);
    response.status(constant_1.HTTP_STATUS.NO_CONTENT_SUCCESS).end();
})));
boardRouter.put("/:id", (0, middleware_1.asyncMiddleware)(middleware_1.ownerExtractor), (0, middleware_1.asyncMiddleware)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jsonwebtoken_1.default.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "token invalid" });
        return;
    }
    const { name } = (0, validators_1.toNewBoard)(request.body);
    if (request.owner !== decodedToken.id) {
        response
            .status(constant_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: "invalid user" });
        return;
    }
    const board = {
        name,
    };
    const updatedBoard = yield board_1.default.findByIdAndUpdate(request.params.id, board, {
        new: true,
        runValidators: true,
        context: "query",
    });
    response.json(updatedBoard);
})));
exports.default = boardRouter;
