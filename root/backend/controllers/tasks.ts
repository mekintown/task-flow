import express, { Request, Response } from "express";
import { asyncMiddleware, authenticateToken } from "../utils/middleware";
import { AuthorizedRequest } from "../types";
import { HTTP_STATUS } from "../utils/constant";
import { toNewTask } from "../utils/validators";
import Task from "../models/task";
import User from "../models/user";
import Board from "../models/board";

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

taskRouter.get(
  "/",
  asyncMiddleware(async (_request: Request, response: Response) => {
    const tasks = await Task.find({}).populate("createdBy", {
      username: 1,
      name: 1,
    });
    response.json(tasks);
  })
);

taskRouter.get(
  "/:boardId",
  authenticateToken,
  asyncMiddleware(async (request: AuthorizedRequest, response: Response) => {
    const user = await User.findById(request.userId);
    if (!user) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "User not found" });
      return;
    }

    const boardId = request.params.boardId;
    const board = await Board.findById(boardId);

    if (!board) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
      return;
    }

    // Check if the board's owner is not the same as the user making the request
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (board.owner.toString() !== user._id.toString()) {
      response
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ error: "You are not authorized to view tasks for this board" });
      return;
    }

    const tasks = await Task.find({ board: boardId }).populate("createdBy", {
      username: 1,
      name: 1,
    });

    response.json(tasks);
  })
);

taskRouter.delete(
  "/:id",
  authenticateToken,
  asyncMiddleware(async (request: AuthorizedRequest, response: Response) => {
    const task = await Task.findById(request.params.id);
    if (!task) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "Task not found" });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (task.createdBy.toString() !== request.userId) {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "invalid user" });
      return;
    }
    await Task.findByIdAndRemove(request.params.id);
    response.status(HTTP_STATUS.NO_CONTENT).end();
  })
);

taskRouter.put(
  "/:id",
  authenticateToken,
  asyncMiddleware(async (request: AuthorizedRequest, response: Response) => {
    const task = await Task.findById(request.params.id);
    if (!task) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "Task not found" });
      return;
    }

    if (JSON.stringify(task.createdBy) !== request.userId) {
      response.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "invalid user" });
      return;
    }

    const { board, title, description, priority, dueDate } = toNewTask(
      request.body
    );
    const updatedTask = await Task.findByIdAndUpdate(
      request.params.id,
      { board, title, description, priority, dueDate },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    response.json(updatedTask);
  })
);

export default taskRouter;
