import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { toLoginUser, toNewUser } from "../utils/validators";
import { ProtectRequest } from "../types";
import { HTTP_STATUS } from "../utils/constant";
import config from "../utils/config";
import validator from "validator";

/**
 * Registers a new user.
 *
 * @param request - The request object.
 * @param response - The response object.
 * @param next - The next function.
 */
const register = async (
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

const login = async (request: Request, response: Response) => {
  const { username, password } = toLoginUser(request.body);

  const user = await User.findOne({ username });
  if (!user) {
    // Simulate password hash comparison time
    await bcrypt.compare(password, bcrypt.hashSync("", config.SALT_ROUNDS));

    response.status(401).json({
      error: "invalid username or password",
    });
    return;
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    response.status(401).json({
      error: "invalid username or password",
    });
    return;
  }

  const userForToken = {
    username: user.username,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
};

const getMe = async (request: ProtectRequest, response: Response) => {
  const user = await User.findById(request.user.id);
  if (!user) {
    response.status(HTTP_STATUS.NOT_FOUND).send({ error: "User not found" });
    return;
  }

  response.json(user);
};

const authController = {
  register,
  login,
  getMe,
};

export default authController;
