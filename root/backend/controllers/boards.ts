import express, { Request, Response } from "express";
import { asyncMiddleware, ownerExtractor } from "../utils/middleware";
import Board from "../models/board";
import { OwnerExtractedRequest, RequestWithToken } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { toNewBoard } from "../utils/typeValidators";
import { HTTP_STATUS } from "../utils/constant";

const boardRouter = express.Router();

boardRouter.post(
  "/",
  asyncMiddleware(async (request: RequestWithToken, response: Response) => {
    const newBoard = toNewBoard(request.body);

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

    const board = new Board({ ...newBoard, owner: user._id });

    const savedBoard = await board.save();
    await user.save();

    const savedBoardPopulated = await Board.findById(savedBoard._id).populate(
      "owner",
      {
        username: 1,
        name: 1,
      }
    );
    response.status(HTTP_STATUS.CREATED).json(savedBoardPopulated);
  })
);

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

boardRouter.delete(
  "/:id",
  asyncMiddleware(ownerExtractor),
  asyncMiddleware(
    async (request: OwnerExtractedRequest, response: Response) => {
      const decodedToken = jwt.verify(request.token!, process.env.SECRET!) as {
        id?: string;
      };

      if (!decodedToken.id) {
        response
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: "token invalid" });
        return;
      }

      if (request.owner !== decodedToken.id) {
        response
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: "invalid user" });
        return;
      }
      await Board.findByIdAndRemove(request.params.id);
      response.status(HTTP_STATUS.NO_CONTENT_SUCCESS).end();
    }
  )
);

boardRouter.put(
  "/:id",
  asyncMiddleware(ownerExtractor),
  asyncMiddleware(
    async (request: OwnerExtractedRequest, response: Response) => {
      const decodedToken = jwt.verify(request.token!, process.env.SECRET!) as {
        id?: string;
      };

      if (!decodedToken.id) {
        response
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: "token invalid" });
        return;
      }

      const { name } = toNewBoard(request.body);

      if (request.owner !== decodedToken.id) {
        response
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: "invalid user" });
        return;
      }

      const board = {
        name,
      };

      const updatedBoard = await Board.findByIdAndUpdate(
        request.params.id,
        board,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );
      response.json(updatedBoard);
    }
  )
);

export default boardRouter;
