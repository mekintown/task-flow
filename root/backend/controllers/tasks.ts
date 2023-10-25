import express, { Response } from "express";
import { asyncMiddleware, authenticateToken } from "../utils/middleware";
import { AuthorizedRequest } from "../types";
import { HTTP_STATUS } from "../utils/constant";
import { toNewTask } from "../utils/validators";
import Task from "../models/task";
import User from "../models/user";

const taskRouter = express.Router();

taskRouter.post(
  "/",
  authenticateToken,
  asyncMiddleware(async (request: AuthorizedRequest, response: Response) => {
    const user = await User.findById(request.userId);
    if (!user) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "User not found" });
      return;
    }
    const newTask = toNewTask(request.body);

    const task = new Task({ ...newTask, createdBy: user._id });
    const savedTask = await task.save();

    const savedTaskPopulated = await Task.findById(savedTask._id).populate(
      "board",
      {
        owner: 1,
        name: 1,
      }
    );
    response.status(HTTP_STATUS.CREATED).json(savedTaskPopulated);
  })
);

export default taskRouter;
