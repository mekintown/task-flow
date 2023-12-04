import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import { HTTP_STATUS } from "../utils/constant";
import { toNewTask } from "../utils/validators";
import Task from "../models/task";
import { AuthorizeRequest, Role } from "../types";
import { authorize, protect } from "../middleware/auth";
import Board from "../models/board";

const taskRouter = express.Router();

taskRouter.post(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    const boardId = request.params.boardId;
    const newTask = toNewTask(request.body);
    const task = new Task({
      ...newTask,
      createdBy: request.user._id,
    });
    const savedTask = await task.save();

    // Update the corresponding board
    await Board.findByIdAndUpdate(boardId, {
      $push: { tasks: savedTask._id },
    });

    const savedTaskPopulated = await Task.findById(savedTask._id).populate({
      path: "createdBy",
      select: "username name",
    });
    response.status(HTTP_STATUS.CREATED).json(savedTaskPopulated);
  })
);

taskRouter.get(
  "/",
  asyncHandler(async (_request: Request, response: Response) => {
    const tasks = await Task.find({}).populate({
      path: "createdBy",
      select: "username name",
    });
    response.json(tasks);
  })
);

taskRouter.get(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor, Role.Visitor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    const board = await Board.findById({
      _id: request.params.boardId,
    }).populate({
      path: "tasks",
    });

    if (!board) {
      response.status(HTTP_STATUS.NOT_FOUND).send({ error: "Board not found" });
      return;
    }

    response.json(board.tasks);
  })
);

taskRouter.delete(
  "/:boardId/:id",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    const { boardId, id } = request.params;

    // Remove task from board
    await Board.findByIdAndUpdate(boardId, {
      $pull: { tasks: id },
    });

    // Delete the task
    await Task.findByIdAndRemove(id);
    response.status(HTTP_STATUS.NO_CONTENT).end();
  })
);

taskRouter.put(
  "/:boardId/:id",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    const { title, description, priority, dueDate } = toNewTask(request.body);
    const updatedTask = await Task.findByIdAndUpdate(
      request.params.id,
      { title, description, priority, dueDate },
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
