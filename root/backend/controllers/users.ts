import { Request, Response } from "express";
import User from "../models/user"; // Assuming that User is the default export from the user model

const getAllUsers = async (_request: Request, response: Response) => {
  const users = await User.find({});
  response.json(users);
};

const userController = {
  getAllUsers,
};

export default userController;
