import { Request, Response } from "express";
import Board from "../models/board";
import { toNewBoard } from "../utils/validators";
import { HTTP_STATUS } from "../utils/constant";
import { ProtectRequest, Role } from "../types";
import mongoose, { ObjectId } from "mongoose";
import User from "../models/user";
import { AnyBulkWriteOperation } from "mongodb";

const addUserBoard = async (
  userId: ObjectId | string,
  boardId: ObjectId | string,
  role: Role
) => {
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { boards: { boardId, role } } },
    { new: true, runValidators: true }
  );
};

const removeUserBoard = async (
  userId: ObjectId | string,
  boardId: ObjectId | string
) => {
  await User.findByIdAndUpdate(
    userId,
    { $pull: { boards: { boardId } } },
    { new: true }
  );
};

const createBoard = async (request: ProtectRequest, response: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const boardData = toNewBoard(request.body);
    if (!Array.isArray(boardData.collaborators)) {
      boardData.collaborators = [];
    }
    boardData.collaborators.push({
      userId: request.user._id,
      role: Role.Owner,
    });
    const board = new Board(boardData);
    const savedBoard = await board.save({ session });

    const bulkOps = boardData.collaborators.map((collaborator) => ({
      updateOne: {
        filter: { _id: collaborator.userId },
        update: {
          $addToSet: {
            boards: { boardId: savedBoard._id, role: collaborator.role },
          },
        },
        upsert: true,
      },
    }));

    await User.bulkWrite(bulkOps as AnyBulkWriteOperation<User>[], {
      session,
    });

    await session.commitTransaction();
    await session.endSession();

    const savedBoardPopulated = await Board.findById(savedBoard._id).populate({
      path: "collaborators.userId",
      select: "username name",
    });

    response.status(HTTP_STATUS.CREATED).json(savedBoardPopulated);
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error; // Handled by global error handler
  }
};

const getAllBoards = async (_request: Request, response: Response) => {
  const boards = await Board.find({})
    .lean()
    .populate([
      {
        path: "tasks",
        select: "title createdBy description dueDate priority",
      },
      {
        path: "collaborators.userId",
        select: "username name",
      },
    ]);
  response.json(boards);
};

const getBoardById = async (request: Request, response: Response) => {
  const board = await Board.findById(request.params.boardId).populate([
    {
      path: "tasks",
      select: "title createdBy description dueDate priority",
    },
    {
      path: "collaborators.userId",
      select: "username name",
    },
  ]);
  if (!board) {
    response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
    return;
  }
  response.json(board);
};

const deleteBoard = async (request: ProtectRequest, response: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const boardId = request.params.boardId;
    const board = await Board.findByIdAndRemove(boardId, { session });
    if (board) {
      const bulkOps = board.collaborators.map((collaborator) => ({
        updateOne: {
          filter: { _id: collaborator.userId },
          update: {
            $pull: {
              boards: { boardId: board._id },
            },
          },
        },
      }));

      await User.bulkWrite(bulkOps as AnyBulkWriteOperation<User>[], {
        session,
      });
    }

    await session.commitTransaction();
    await session.endSession();

    response.status(HTTP_STATUS.NO_CONTENT).end();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const updateBoard = async (request: ProtectRequest, response: Response) => {
  const boardId = request.params.boardId;
  const { name, collaborators } = toNewBoard(request.body);
  const originalBoard = await Board.findById(boardId);
  if (!originalBoard) {
    response.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
    return;
  }

  const updatedBoard = await Board.findByIdAndUpdate(
    boardId,
    { name, collaborators },
    { new: true, runValidators: true, context: "query" }
  );

  if (collaborators) {
    // Find collaborators to add and remove
    const collaboratorsToAdd = collaborators.filter(
      (collaborator) =>
        !originalBoard.collaborators.some(
          (c) => c.userId === collaborator.userId
        )
    );
    const collaboratorsToRemove = originalBoard.collaborators.filter(
      (originalCollaborator) =>
        !collaborators.some((c) => c.userId === originalCollaborator.userId)
    );

    // Perform batch operations
    await Promise.all([
      ...collaboratorsToAdd.map((collaborator) =>
        addUserBoard(collaborator.userId, boardId, collaborator.role)
      ),
      ...collaboratorsToRemove.map((collaborator) =>
        removeUserBoard(collaborator.userId, boardId)
      ),
    ]);
  }
  response.json(updatedBoard);
};

const boardController = {
  createBoard,
  getAllBoards,
  getBoardById,
  deleteBoard,
  updateBoard,
};

export default boardController;
