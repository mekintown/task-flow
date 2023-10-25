import express, { Request, Response } from "express";
import {
  asyncMiddleware,
  authenticateToken,
  ownerExtractor,
} from "../utils/middleware";
import Board from "../models/board";
import { AuthorizedRequest, OwnerExtractedRequest } from "../types";
import User from "../models/user";
import { toNewBoard } from "../utils/validators";
import { HTTP_STATUS } from "../utils/constant";

const boardRouter = express.Router();

boardRouter.post(
  "/",
  authenticateToken,
  asyncMiddleware(async (request: AuthorizedRequest, response: Response) => {
    const user = await User.findById(request.userId);
    if (!user) {
      response
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: "User not found" });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const board = new Board({ ...toNewBoard(request.body), owner: user._id });
    const savedBoard = await board.save();

    const savedBoardPopulated = await Board.findById(savedBoard._id).populate(
      "owner",
      { username: 1, name: 1 }
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
  authenticateToken,
  asyncMiddleware(ownerExtractor),
  asyncMiddleware(
    async (request: OwnerExtractedRequest, response: Response) => {
      if (request.owner !== request.userId) {
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
  authenticateToken,
  asyncMiddleware(ownerExtractor),
  asyncMiddleware(
    async (request: OwnerExtractedRequest, response: Response) => {
      if (request.owner !== request.userId) {
        response
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: "invalid user" });
        return;
      }

      const { name } = toNewBoard(request.body);
      const updatedBoard = await Board.findByIdAndUpdate(
        request.params.id,
        { name },
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
