import fs from "fs";
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import { uploadSingleImage } from "../middleware/uploadImage.middleware.js";

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

export const updateUser = updateOne(UserModel, "User");

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
