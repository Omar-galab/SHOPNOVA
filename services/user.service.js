// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import {
  uploadSingleImage,
  handleUpload,
} from "../middleware/uploadImage.middleware.js";
import ApiError from "../utils/apiError.js";
import createToken from "../utils/createToken.js";

import {
  deleteOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.service.js";

export const getAllUsers = getAll(UserModel);

export const getUser = getOne(UserModel, "User");

export const createUser = createOne(UserModel);

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
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

// @desc    Update user password
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private
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

// @desc    Upload user profile image
// @route   PUT /api/v1/users/:id/uploadImage
// @access  private
export const resizeUserImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  //  Upload to Cloudinary
  req.body.profileImage = await handleUpload(
    req.file, // ← file object
    "users", // ← folder in Cloudinary
    600, // ← width
    600, // ← height
  );

  next();
});

export const uploadUserImage = uploadSingleImage("profileImage");

// @desc    Get logged user data
// @route   GET /api/v1/users/getMe
// @access  private
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updatePassword
// @access  private
export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(), // 👈 Record when password changed
    },
    {
      new: true,
    },
  );
  const token = createToken(user._id);
  if (!user) {
    return next(new ApiError(`User not found with id: ${req.user._id}`, 404));
  }

  res.status(200).json({
    // 👈 Send response
    status: "success",
    message: "Password updated successfully",
    data: user,
    token, // 👈 Send token!
  });
});

export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
// @desc    Delete logged user account
// @route   DELETE /api/v1/users/deleteMe
// @access  private
export const deleteLoggedUserData = asyncHandler(async (req, res) => {
  req.params.id = req.user._id;
  await UserModel.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: "success",
    message: "User account deleted successfully",
  });
});
