import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model
import { toNewUser } from "../utils/validators";
import { asyncMiddleware } from "../utils/middleware";
import { HTTP_STATUS } from "../utils/constant";
import config from "../utils/config";
import validator from "validator";

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

      if (
        !password ||
        password.length < 8 ||
        !validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 2,
          minSymbols: 1,
          returnScore: false,
          pointsPerUnique: 1,
          pointsPerRepeat: 0.5,
          pointsForContainingLower: 10,
          pointsForContainingUpper: 10,
          pointsForContainingNumber: 10,
          pointsForContainingSymbol: 10,
        })
      ) {
        const error = new Error(
          "Password does not meet strength requirements. It must have at least 8 characters, include uppercase, lowercase, at least 2 numbers, and a symbol."
        );
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
