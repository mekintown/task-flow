import express from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import { authorize, protect } from "../middleware/auth";
import { Role } from "../types";
import boardController from "../controllers/boards";

const boardRouter = express.Router();

boardRouter.post(
  "/",
  asyncHandler(protect),
  asyncHandler(boardController.createBoard)
);
boardRouter.get("/", asyncHandler(boardController.getAllBoards));
boardRouter.get("/:boardId", asyncHandler(boardController.getBoardById));
boardRouter.delete(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner)),
  asyncHandler(boardController.deleteBoard)
);
boardRouter.put(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner)),
  asyncHandler(boardController.updateBoard)
);

export default boardRouter;
