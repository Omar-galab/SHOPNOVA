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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} from "../services/user.service.js";
import { protect, allowTo } from "../services/auth.service.js";
import {
  changeUserPasswordValidator,
  createUserValidator,
  updateUserValidator,
} from "../utils/validator/user.validator.js";
import { deleteBrandValidator } from "../utils/validator/brand.validator.js";

const router = express.Router();

router.use(protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/updatePassword", updateLoggedUserPassword);
router.put(
  "/updateMe",
  uploadUserImage,
  resizeUserImage,
  updateLoggedUserData,
  updateLoggedUserData,
  updateUser,
);
router.delete("/deleteMe", deleteLoggedUserData);
router.use(allowTo("admin"));
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
