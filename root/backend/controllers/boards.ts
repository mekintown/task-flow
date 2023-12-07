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

const updateUserBoardRole = async (
  userId: ObjectId | string,
  boardId: ObjectId | string,
  newRole: Role
) => {
  await User.findOneAndUpdate(
    { _id: userId, "boards.boardId": boardId },
    { $set: { "boards.$.role": newRole } },
    { new: true, runValidators: true }
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

  // Update board name and collaborators list
  const updatedBoard = await Board.findByIdAndUpdate(
    boardId,
    { name, collaborators },
    { new: true, runValidators: true, context: "query" }
  );

  if (collaborators) {
    // Determine role changes and additions/removals
    const updates = collaborators.map((collaborator) => {
      const originalCollaborator = originalBoard.collaborators.find(
        (c) => c.userId == collaborator.userId
      );

      console.log(collaborator);
      if (!originalCollaborator) {
        console.log("role equal");
        return addUserBoard(collaborator.userId, boardId, collaborator.role); // New collaborator added
      } else if (originalCollaborator.role !== collaborator.role) {
        console.log("role not equal");
        return updateUserBoardRole(
          collaborator.userId,
          boardId,
          collaborator.role
        ); // Role updated
      }
      console.log("not met condition");
      return Promise.resolve(); // No change
    });

    const removals = originalBoard.collaborators
      .filter(
        (originalCollaborator) =>
          !collaborators.some((c) => c.userId == originalCollaborator.userId)
      )
      .map((collaborator) => removeUserBoard(collaborator.userId, boardId)); // Collaborator removed

    // Perform batch operations
    await Promise.all([...updates, ...removals]);
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
