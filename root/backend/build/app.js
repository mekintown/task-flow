"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./utils/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const users_1 = __importDefault(require("./controllers/users"));
const app = (0, express_1.default)();
if (config_1.default.MONGODB_URI) {
    mongoose_1.default
        .connect(config_1.default.MONGODB_URI)
        .then(() => {
        logger_1.default.info("connected to", config_1.default.MONGODB_URI);
    })
        .catch((error) => {
        logger_1.default.error("error connecting to MongoDB:", error.message);
    });
}
else {
    logger_1.default.error("MONGODB_URI is not defined");
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(middleware_1.default.requestLogger);
app.use("/api/users", users_1.default);
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
