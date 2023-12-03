import express, { Request, Response } from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import Board from "../models/board";
import { toNewBoard } from "../utils/validators";
import { HTTP_STATUS } from "../utils/constant";
import { authorize, protect } from "../middleware/auth";
import { Collaborator, ProtectRequest, Role } from "../types";
import { ObjectId } from "mongoose";
import User from "../models/user";

const boardRouter = express.Router();

async function addUserBoard(
  userId: ObjectId | string,
  boardId: ObjectId | string,
  role: Role
) {
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { boards: { boardId, role } } },
    { new: true, runValidators: true }
  );
}

// Removes a board from a user's boards array
async function removeUserBoard(
  userId: ObjectId | string,
  boardId: ObjectId | string
) {
  await User.findByIdAndUpdate(
    userId,
    { $pull: { boards: { boardId } } },
    { new: true }
  );
}

boardRouter.post(
  "/",
  asyncHandler(protect),
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    const boardData = toNewBoard(request.body);

    // Ensuring collaborators array exists and adding the creator as Owner
    if (!Array.isArray(boardData.collaborators)) {
      boardData.collaborators = [];
    }
    boardData.collaborators.push({
      userId: request.user._id,
      role: Role.Owner,
    });

    const board = new Board(boardData);
    const savedBoard = await board.save();

    // Add the board to each collaborator's user boards array
    for (const collaborator of boardData.collaborators) {
      await addUserBoard(
        collaborator.userId,
        savedBoard._id,
        collaborator.role
      );
    }

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
  asyncHandler(authorize(Role.Owner)),
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    const boardId = request.params.boardId;
    const board = await Board.findById(boardId);

    if (board) {
      // Remove the board from each collaborator's user boards array
      for (const collaborator of board.collaborators) {
        await removeUserBoard(collaborator.userId, boardId);
      }
    }

    await Board.findByIdAndRemove(boardId);
    response.status(HTTP_STATUS.NO_CONTENT).end();
  })
);

boardRouter.put(
  "/:boardId",
  asyncHandler(protect),
  asyncHandler(authorize(Role.Owner)),
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    const boardId = request.params.boardId;
    const { name, collaborators } = toNewBoard(request.body);

    const originalBoard = await Board.findById(boardId);
    if (!originalBoard) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
      return;
    }
    // Update the board
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { name, collaborators },
      { new: true, runValidators: true, context: "query" }
    );

    // Update user boards for new collaborators
    if (collaborators) {
      // Add new collaborators to user boards
      for (const collaborator of collaborators) {
        if (
          !originalBoard.collaborators.some(
            (c: Collaborator) => c.userId === collaborator.userId
          )
        ) {
          await addUserBoard(collaborator.userId, boardId, collaborator.role);
        }
      }

      // Remove removed collaborators from user boards
      for (const originalCollaborator of originalBoard.collaborators) {
        if (
          !collaborators.some(
            (c: Collaborator) => c.userId === originalCollaborator.userId
          )
        ) {
          await removeUserBoard(originalCollaborator.userId, boardId);
        }
      }
    }

    response.json(updatedBoard);
  })
);

export default boardRouter;
