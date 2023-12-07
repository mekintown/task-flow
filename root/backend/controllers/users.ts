import { Request, Response } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model
import { ProtectRequest } from "../types";
import { HTTP_STATUS } from "../utils/constant";

const getAllUsers = async (_request: Request, response: Response) => {
  const users = await User.find({});
  response.json(users);
};

// In userController.js

const getUserBoards = async (request: ProtectRequest, response: Response) => {
  try {
    const userId = request.user._id; // Assuming you have the user's ID from the request
    const userWithBoards = await User.findById(userId)
      .populate({
        path: "boards.boardId",
        select: "name collaborators",
        populate: {
          path: "collaborators.userId",
          select: "username name _id",
        },
      })
      .lean();

    if (!userWithBoards) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ error: "User not found" });
      return;
    }

    response.json(userWithBoards.boards);
  } catch (error) {
    if (error instanceof Error) {
      response
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    } else {
      response
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "An unknown error occurred" });
    }
  }
};

const userController = {
  getAllUsers,
  getUserBoards,
};

export default userController;
