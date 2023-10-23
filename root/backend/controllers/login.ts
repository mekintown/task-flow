import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User from "../models/user";
import { asyncMiddleware } from "../utils/middleware";
import { toLoginUser } from "../utils/typeValidators";

const loginRouter = express.Router();

loginRouter.post(
  "/",
  asyncMiddleware(async (request: Request, response: Response) => {
    const { username, password } = toLoginUser(request.body);

    const user = await User.findOne({ username });
    const passwordCorrect = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordCorrect) {
      response.status(401).json({
        error: "invalid username or password",
      });
      return;
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret);

    response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  })
);

export default loginRouter;
