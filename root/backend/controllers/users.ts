import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model
import { toNewUser } from "../utils/validators";
import { asyncHandler } from "../middleware/commonMiddleware";
import { HTTP_STATUS } from "../utils/constant";
import config from "../utils/config";
import validator from "validator";
import { protect } from "../middleware/auth";
import { ProtectRequest } from "../types";

const usersRouter = express.Router();

usersRouter.get(
  "/",
  asyncHandler(async (_request: Request, response: Response) => {
    const users = await User.find({});
    response.json(users);
  })
);

usersRouter.post(
  "/",
  asyncHandler(
    async (request: Request, response: Response, next: NextFunction) => {
      const { username, name, password } = toNewUser(request.body);
      if (
        !password ||
        !validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 0,
          minNumbers: 1,
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
          "Password does not meet strength requirements. It must have at least 8 characters, include uppercase, lowercase and at least 1 numbers."
        );
        error.name = "ValidationError";
        next(error);
        return;
      }

      const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS);

      const user = new User({ username, name, passwordHash, boards: [] });

      const savedUser = await user.save();

      response.status(HTTP_STATUS.CREATED).json(savedUser);
    }
  )
);

usersRouter.get(
  "/me",
  asyncHandler(protect), // Use the authentication middleware
  asyncHandler(async (request: ProtectRequest, response: Response) => {
    const user = await User.findById(request.user.id);
    if (!user) {
      response.status(HTTP_STATUS.NOT_FOUND).send({ error: "User not found" });
      return;
    }

    response.json(user);
  })
);
export default usersRouter;
