import express from "express";

import {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  updateUserPassword,
} from "../services/user.service.js";
import {
  changeUserPasswordValidator,
  createUserValidator,
  updateUserValidator,
} from "../utils/validator/user.validator.js";

const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, createUserValidator, resizeUserImage, createUser);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, updateUserValidator, resizeUserImage, updateUser)
  .delete(deleteUser);

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  updateUserPassword,
);

export default router;
