import express from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import { authorize, protect } from "../middleware/auth";
import { Role } from "../types";
import taskController from "../controllers/tasks";

const taskRouter = express.Router();

taskRouter.post(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(taskController.createTask)
);
taskRouter.get("/", asyncHandler(taskController.getAllTasks));
taskRouter.get(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor, Role.Visitor)),
  asyncHandler(taskController.getTasksByBoard)
);
taskRouter.delete(
  "/:boardId/:id",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(taskController.deleteTask)
);
taskRouter.put(
  "/:boardId/:id",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner, Role.Editor)),
  asyncHandler(taskController.updateTask)
);

export default taskRouter;
