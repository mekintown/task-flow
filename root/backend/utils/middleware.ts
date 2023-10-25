import { Request, Response, NextFunction } from "express";
import logger from "./logger";
import { OwnerExtractedRequest, RequestWithToken } from "../types";
import Board from "../models/board";

const requestLogger = (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

export const asyncMiddleware =
  (
    fn: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => void | Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const tokenExtractor = (
  request: RequestWithToken,
  _response: Response,
  next: NextFunction
) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
};

const unknownEndpoint = (
  _request: RequestWithToken,
  response: Response
): void => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
): void => {
  logger.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    response.status(400).json({ error: error.message });
  } else {
    next(error);
  }
};

export const ownerExtractor = async (
  request: OwnerExtractedRequest,
  _response: Response,
  next: NextFunction
) => {
  const board = await Board.findById(request.params.id);
  if (board) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    request.owner = board.owner.toString();
  }

  next();
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  asyncMiddleware,
  ownerExtractor,
};
