import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./utils/config";
import logger from "./utils/logger";
import middleware from "./utils/middleware";
import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import boardRouter from "./controllers/boards";

const app: Express = express();

if (config.MONGODB_URI) {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info("connected to", config.MONGODB_URI);
    })
    .catch((error: Error) => {
      logger.error("error connecting to MongoDB:", error.message);
    });
} else {
  logger.error("MONGODB_URI is not defined");
}

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/boards", boardRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
