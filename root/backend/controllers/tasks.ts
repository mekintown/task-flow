import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import { HTTP_STATUS } from "../utils/constant";
import { toNewTask } from "../utils/validators";
import Task from "../models/task";
import { AuthorizeRequest, Role } from "../types";
import { authorize, protect } from "../middleware/auth";

const taskRouter = express.Router();

taskRouter.post(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    const newTask = toNewTask(request.body);
    const task = new Task({ ...newTask, createdBy: request.user });
    const savedTask = await task.save();

    const savedTaskPopulated = await Task.findById(savedTask._id).populate(
      "board"
    );
    response.status(HTTP_STATUS.CREATED).json(savedTaskPopulated);
  })
);

taskRouter.get(
  "/",
  asyncHandler(async (_request: Request, response: Response) => {
    const tasks = await Task.find({}).populate("createdBy", {
      username: 1,
      name: 1,
    });
    response.json(tasks);
  })
);

taskRouter.get(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor, Role.Visitor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    const tasks = await Task.find({ board: request.board.id }).populate(
      "createdBy",
      {
        username: 1,
        name: 1,
      }
    );

    response.json(tasks);
  })
);

taskRouter.delete(
  "/:boardId/:id",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(async (request: AuthorizeRequest, response: Response) => {
    await Task.findByIdAndRemove(request.params.id);
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
