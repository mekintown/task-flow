import express, { Request, Response } from "express";
import { asyncMiddleware, ownerExtractor } from "../utils/middleware";
import { OwnerExtractedRequest, RequestWithToken } from "../types";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../utils/constant";
import { toNewTask } from "../utils/validators";
import Task from "../models/task";

const boardRouter = express.Router();

boardRouter.post(
  "/",
  asyncMiddleware(async (request: RequestWithToken, response: Response) => {
    const newTask = toNewTask(request.body);
    if (!request.token) {
      response
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "Token not provided in the request" });
      return;
    }
    const SECRET = process.env.SECRET;
    if (!SECRET) {
      response
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "SECRET environment variable is not set" });
      return;
    }
    const decodedToken = jwt.verify(request.token, SECRET) as {
      id?: string;
    };
    if (!decodedToken.id) {
      response
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "token invalid" });
      return;
    }

    const task = new Task({ ...newTask });
    const savedTask = await task.save();

    const savedTaskPopulated = await Task.findById(savedTask._id).populate(
      "blog",
      {
        owner: 1,
        name: 1,
      }
    );
    response.status(HTTP_STATUS.CREATED).json(savedTaskPopulated);
  })
);
