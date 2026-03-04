import express from "express";

import {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
} from "../services/user.service.js";
import {
  getUserValidator,
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

export default router;
