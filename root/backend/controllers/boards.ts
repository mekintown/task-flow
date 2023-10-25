import express, { Request, Response } from "express";
import { asyncMiddleware } from "../utils/middleware";
import Board from "../models/board";
import { RequestWithToken } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { toNewBoard } from "../utils/typeValidators";

const boardRouter = express.Router();

boardRouter.get(
  "/",
  asyncMiddleware(async (_request: Request, response: Response) => {
    const boards = await Board.find({}).populate("owner", {
      username: 1,
      name: 1,
    });
    response.json(boards);
  })
);

boardRouter.post(
  "/",
  asyncMiddleware(async (request: RequestWithToken, response: Response) => {
    const newBoard = toNewBoard(request.body);

    if (!request.token) {
      response.status(401).json({ error: "Token not provided in the request" });
      return;
    }

    if (!process.env.SECRET) {
      response
        .status(401)
        .json({ error: "SECRET environment variable is not set" });
      return;
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET) as {
      id?: string;
    };
    if (!decodedToken.id) {
      response.status(401).json({ error: "token invalid" });
      return;
    }

    const user = await User.findById(decodedToken.id);

    const board = new Board({ ...newBoard, owner: user!._id });

    const savedBoard = await board.save();
    user!.boards = user!.boards.concat([savedBoard.id]);
    await user!.save();

    const savedBoardPopulated = await Board.findById(savedBoard._id).populate(
      "owner",
      {
        username: 1,
        name: 1,
      }
    );
    response.status(201).json(savedBoardPopulated);
  })
);

export default boardRouter;
