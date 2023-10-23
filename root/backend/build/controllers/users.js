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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user")); // Assuming that User is the default export from the user model
const typeValidators_1 = require("../utils/typeValidators");
const middleware_1 = require("../utils/middleware");
const usersRouter = express_1.default.Router();
usersRouter.post("/", (0, middleware_1.asyncMiddleware)((request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, password } = (0, typeValidators_1.toNewUser)(request.body);
    if (!password || password.length < 3) {
        const error = new Error("Password must be at least 3 characters long.");
        error.name = "ValidationError";
        next(error);
        return;
    }
    const saltRounds = 10;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    const user = new user_1.default({ username, name, passwordHash });
    const savedUser = yield user.save();
    response.status(201).json(savedUser);
})));
usersRouter.get("/", (0, middleware_1.asyncMiddleware)((_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    response.json(users);
})));
exports.default = usersRouter;
