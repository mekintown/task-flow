import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model
import { toNewUser } from "../utils/typeValidators";

const usersRouter = express.Router();

function asyncMiddleware(
  fn: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

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

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({ username, name, passwordHash });

      const savedUser = await user.save();

      response.status(201).json(savedUser);
    }
  )
);

usersRouter.get(
  "/",
  asyncMiddleware(async (_request: Request, response: Response) => {
    const users = await User.find({});
    response.json(users);
  })
);

export default usersRouter;
