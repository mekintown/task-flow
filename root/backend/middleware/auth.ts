import { NextFunction, Response } from "express";
import { AuthorizeRequest, ProtectRequest } from "../types";
import { HTTP_STATUS } from "../utils/constant";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Board from "../models/board";

export const protect = async (
  req: ProtectRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }
  if (!token) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Token not provided in the request" });
    return;
  }

  const SECRET = process.env.SECRET;
  if (!SECRET) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "SECRET environment variable is not set" });
    return;
  }

  const decodedToken = jwt.verify(token, SECRET) as { id?: string };
  if (!decodedToken.id) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "token invalid" });
    return;
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ error: "Cant find user with token" });
    return;
  }
  req.user = user;
  next();
};

export const authorize = (
  ...roles: string[]
): ((
  req: AuthorizeRequest,
  res: Response,
  next: NextFunction
) => Promise<void>) => {
  return async (req: AuthorizeRequest, res: Response, next: NextFunction) => {
    const boardId = req.params.boardId;
    if (!boardId) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "Board ID not provided" });
      return;
    }
    if (!req.user?._id) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "User not provided" });
      return;
    }

    const board = await Board.findById(boardId).exec();
    if (!board) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Board not found" });
      return;
    }

    const collaborator = board.collaborators.find(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      (c) => c.userId.toString() === req.user._id.toString()
    );
    if (!collaborator) {
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ error: "User is not a collaborator on this board" });
      return;
    }

    const userRole = collaborator.role;
    if (!roles.includes(userRole)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        error: `User role ${userRole} is not authorized to access this route`,
      });
      return;
    }

    req.board = board;
    next();
  };
};
