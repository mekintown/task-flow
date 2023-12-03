import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import Board from "../models/board";
import { toNewBoard } from "../utils/validators";
import { HTTP_STATUS } from "../utils/constant";
import { authorize, protect } from "../middleware/auth";
import { ProtectRequest, Role } from "../types";

const boardRouter = express.Router();

boardRouter.post(
  "/",
  asyncHandler(protect),
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    const boardData = toNewBoard(request.body);
    if (!Array.isArray(boardData.collaborators)) {
      boardData.collaborators = [];
    }
    boardData.collaborators.push({
      userId: request.user._id,
      role: Role.Owner,
    });
    const board = new Board(boardData);
    const savedBoard = await board.save();

    const savedBoardPopulated = await Board.findById(savedBoard._id).populate({
      path: "collaborators.userId",
      select: "username name",
    });
    response.status(HTTP_STATUS.CREATED).json(savedBoardPopulated);
  })
);

boardRouter.get(
  "/",
  asyncHandler(async (_request: Request, response: Response) => {
    const boards = await Board.find({})
      .populate({
        path: "tasks",
        select: "title createdBy description dueDate priority",
      })
      .populate({
        path: "collaborators.userId",
        select: "username name",
      });

    response.json(boards);
  })
);

boardRouter.get(
  "/:boardId",
  asyncHandler(async (request: Request, response: Response) => {
    const board = await Board.findById(request.params.boardId)
      .populate("tasks")
      .populate("collaborators.userId");
    if (!board) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
      return;
    }
    response.json(board);
  })
);

boardRouter.delete(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize("Owner")),
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    await Board.findByIdAndRemove(request.params.boardId);
    response.status(HTTP_STATUS.NO_CONTENT).end();
  })
);

boardRouter.put(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize("Owner")),
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    const { name } = toNewBoard(request.body);
    const updatedBoard = await Board.findByIdAndUpdate(
      request.params.boardId,
      { name },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    response.json(updatedBoard);
  })
);

export default boardRouter;
