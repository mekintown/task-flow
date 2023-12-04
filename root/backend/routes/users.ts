import express from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import userController from "../controllers/users";

const usersRouter = express.Router();

usersRouter.get("/", asyncHandler(userController.getAllUsers));

// export the router
export default usersRouter;
