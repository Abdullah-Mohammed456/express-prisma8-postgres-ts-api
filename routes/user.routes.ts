import express from "express";
import * as userController from "../controllers/user.controller.js";
import { validateUser } from "../middleware/validateUser.js";
import { validateUserUpdate } from "../middleware/validateUserUpdate.js";
import { validateID } from "../middleware/validateId.js";
import * as auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/", validateUser, userController.createUser);

userRouter.post("/login", userController.loginUser);

userRouter.use(auth.validateToken);

userRouter.get("/", userController.getUsers);

userRouter.get("/:id", validateID, userController.getUserById);

userRouter.patch(
  "/:id",
  validateID,
  validateUserUpdate,
  userController.updateUser,
);

userRouter.delete(
  "/:id",
  auth.authorizeAdmin,
  validateID,
  userController.deleteUser,
);

export default userRouter;
