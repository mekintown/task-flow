import { Request, Response, NextFunction } from "express";
import logger from "./logger";

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

const unknownEndpoint = (_request: Request, response: Response): void => {
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

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
