import express from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import userController from "../controllers/users";
import { protect } from "../middleware/auth";

const usersRouter = express.Router();

usersRouter.get("/", asyncHandler(userController.getAllUsers));
usersRouter.get(
  "/boards",
  asyncHandler(protect), // Ensure this is a protected route
  asyncHandler(userController.getUserBoards)
);

usersRouter.get(
  "/find/:username",
  asyncHandler(userController.findUserByUsername)
);

// export the router
export default usersRouter;
