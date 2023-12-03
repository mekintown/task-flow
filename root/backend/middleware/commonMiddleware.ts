import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

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

export const asyncHandler = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
};

const unknownEndpoint = (_request: Request, response: Response): void => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  logger.error(error.message);

  switch (error.name) {
    case "CastError":
      response.status(400).send({ error: "malformatted id" });
      break;
    case "ValidationError":
      response.status(400).json({ error: error.message });
      break;
    case "JsonWebTokenError":
      response.status(401).json({ error: "Unauthorized" });
      break;
    default:
      // If none of the above, it's an unknown error
      response.status(500).json({ error: "Internal server error" });
  }
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  asyncHandler,
};
