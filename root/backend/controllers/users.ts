import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model
import { toNewUser } from "../utils/validators";
import { HTTP_STATUS } from "../utils/constant";
import config from "../utils/config";
import validator from "validator";

const getAllUsers = async (_request: Request, response: Response) => {
  const users = await User.find({});
  response.json(users);
};

const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
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
};

const userController = {
  getAllUsers,
  createUser,
};

export default userController;
