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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const middleware_1 = require("../utils/middleware");
const typeValidators_1 = require("../utils/typeValidators");
const loginRouter = express_1.default.Router();
loginRouter.get("/", (0, middleware_1.asyncMiddleware)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = (0, typeValidators_1.toLoginUser)(request.body);
    const user = yield user_1.default.findOne({ username });
    const passwordCorrect = user
        ? yield bcrypt_1.default.compare(password, user.passwordHash)
        : false;
    if (!user || !passwordCorrect) {
        response.status(401).json({
            error: "invalid username or password",
        });
        return;
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(userForToken, process.env.SECRET);
    response
        .status(200)
        .send({ token, username: user.username, name: user.name });
})));
exports.default = loginRouter;
