import express, { Request, Response } from "express";
import { asyncMiddleware, ownerExtractor } from "../utils/middleware";
import { OwnerExtractedRequest, RequestWithToken } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { HTTP_STATUS } from "../utils/constant";

const boardRouter = express.Router();

boardRouter.post(
  "/",
  asyncMiddleware(async (request: RequestWithToken, response: Response) => {
    const newBoard = toNewTask(request.body);
    if (!request.token) {
      response
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "Token not provided in the request" });
      return;
    }
    const SECRET = process.env.SECRET;
    if (!SECRET) {
      response
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "SECRET environment variable is not set" });
      return;
    }
    const decodedToken = jwt.verify(request.token, SECRET) as {
      id?: string;
    };
    if (!decodedToken.id) {
      response
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: "token invalid" });
      return;
    }
    const user = await User.findById(decodedToken.id);
    if (!user) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "User not found" });
      return;
    }
    // const board = new Board({ ...newBoard, owner: user._id });
    // const savedBoard = await board.save();
    // await user.save();
    // const savedBoardPopulated = await Board.findById(savedBoard._id).populate(
    //   "owner",
    //   {
    //     username: 1,
    //     name: 1,
    //   }
    // );
    // response.status(HTTP_STATUS.CREATED).json(savedBoardPopulated);
  })
);
