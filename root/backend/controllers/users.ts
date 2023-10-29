import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model
import { toNewUser } from "../utils/validators";
import { asyncMiddleware } from "../utils/middleware";
import { HTTP_STATUS } from "../utils/constant";
import config from "../utils/config";

const usersRouter = express.Router();

usersRouter.get(
  "/",
  asyncMiddleware(async (_request: Request, response: Response) => {
    const users = await User.find({});
    response.json(users);
  })
);

usersRouter.post(
  "/",
  asyncMiddleware(
    async (request: Request, response: Response, next: NextFunction) => {
      const { username, name, password } = toNewUser(request.body);

      if (!password || password.length < 3) {
        const error = new Error("Password must be at least 3 characters long.");
        error.name = "ValidationError";
        next(error);
        return;
      }

      const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS);

      const user = new User({ username, name, passwordHash });

      const savedUser = await user.save();

      response.status(HTTP_STATUS.CREATED).json(savedUser);
    }
  )
);
export default usersRouter;
