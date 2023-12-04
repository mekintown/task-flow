import express from "express";
import { asyncHandler } from "../middleware/commonMiddleware";
import { protect } from "../middleware/auth";
import authController from "../controllers/auth";

const authRouter = express.Router();

// authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.get(
  "/me",
  asyncHandler(protect),
  asyncHandler(authController.getMe)
);

export default authRouter;
