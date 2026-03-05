import fs from "fs";
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import { uploadSingleImage } from "../middleware/uploadImage.middleware.js";
import ApiError from "../utils/apiError.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.service.js";

export const getAllUsers = getAll(UserModel);

export const getUser = getOne(UserModel, "User");

export const createUser = createOne(UserModel);

export const updateUser = asyncHandler(async (req, res, next) => {
  const doc = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      slug: req.body.slug,
      role: req.body.role,
      status: req.body.status,
    },
    {
      new: true,
    },
  );
  if (!doc) {
    return next(new ApiError(`${req.params.id} not found`, 404));
  }
  res.status(200).json(doc);
});

export const updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(), // 👈 Record when password changed
    },
    {
      new: true,
    },
  );

  if (!user) {
    return next(new ApiError(`User not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    // 👈 Send response!
    status: "success",
    message: "Password updated successfully",
    data: user,
  });
});

export const deleteUser = deleteOne(UserModel, "User");

export const resizeUserImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // Auto-create folder if not exists
  const dir = "uploads/users";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${dir}/${fileName}`);

  req.body.profileImage = fileName;

  next();
});

export const uploadUserImage = uploadSingleImage("profileImage");

export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
