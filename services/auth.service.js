import bcrypt from "bcryptjs";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import createToken from "../utils/createToken.js";

// eslint-disable-next-line import/prefer-default-export

// @desc    Signup a new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);
  res.status(201).json({
    data: user,
    token,
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user || (await bcrypt.compare(password, user.password)) === false) {
    return next(new ApiError("Invalid email or password", 401));
  }
  const token = createToken(user._id);
  res.status(201).json({
    data: user,
    token,
  });
});
// @desc    Protect routes
// @route   GET /api/v1/protected
// @access  Private
export const protect = asyncHandler(async (req, res, next) => {
  // 1) Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access", 401),
    );
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Check if user exists
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return next(
      new ApiError("The user belonging to this token no longer exists", 401),
    );
  }

  // Check if password changed after token issued
  if (user.passwordChangedAt) {
    const changedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10,
    );
    // Token issued before password changed, so token is invalid
    if (decoded.iat < changedTimestamp) {
      return next(
        new ApiError("User recently changed password. Please login again", 401),
      );
    }
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});
// @desc    Restrict to specific roles
// @route   PUT /api/v1/users/:id
// @access  Private
export const allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //access roles is an array of allowed roles for this route
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403),
      );
    }
    next();
  });
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with that email address", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = resetCodeHash;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  const message = `Hi ${user.name}, \n Your password reset code is: ${resetCode}. \n This code is valid for 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent to email!" });
});

// @desc    Verify reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: resetCodeHash,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success", message: "Reset code verified!" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("There is no user with that email address", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token = createToken(user._id);
  res
    .status(200)
    .json({ status: "success", message: "Password reset successful!", token });
});
