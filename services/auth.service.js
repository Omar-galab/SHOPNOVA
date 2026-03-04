import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";

// eslint-disable-next-line import/prefer-default-export

const createToken = (payload) =>
  jwt.sign(
    {
      userId: payload,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

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
