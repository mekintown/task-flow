import express, { Request, Response } from "express";
import BoardCollaborator from "../models/boardCollaborator";
import Board from "../models/board";
import User from "../models/user";
import { HTTP_STATUS } from "../utils/constant";
import { asyncMiddleware, authenticateToken } from "../utils/middleware";
import { toNewBoardCollaborator } from "../utils/validators";

const boardCollaboratorRouter = express.Router();

boardCollaboratorRouter.post(
  "/:boardId",
  authenticateToken,
  asyncMiddleware(async (request: Request, response: Response) => {
    const boardId = request.params.boardId;

    // Check if the board exists
    const board = await Board.findById(boardId);
    if (!board) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
      return;
    }

    // Check if the user exists
    const { username } = toNewBoardCollaborator(request.body);
    const user = await User.findOne({ username: username });
    if (!user) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "User not found" });
      return;
    }

    // Check if the user is already a collaborator
    const existingCollaboration = await BoardCollaborator.findOne({
      board: boardId,
      user: user._id,
    });
    if (existingCollaboration) {
      response
        .status(HTTP_STATUS.CONFLICT)
        .json({ error: "User is already a collaborator on this board" });
      return;
    }

    const collaboration = new BoardCollaborator({
      board: boardId,
      user: user._id,
    });

    const savedCollaboration = await collaboration.save();
    response.status(HTTP_STATUS.CREATED).json(savedCollaboration);
  })
);
