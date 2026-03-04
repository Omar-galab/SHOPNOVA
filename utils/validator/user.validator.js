import { param, check, body } from "express-validator";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import validatorMiddleware from "../../middleware/validator.middleware.js";
import userModel from "../../models/user.model.js";
import ApiError from "../apiError.js";

export const getUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  validatorMiddleware,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("User name must be less than 50 characters long"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .notEmpty()
    .withMessage("Email is required")

    .custom(
      asyncHandler(async (email) => {
        const user = await userModel.findOne({ email });
        if (user) throw new ApiError("Email already exists", 400);
      }),
    ),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("profileImage").optional(),

  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number")
    .optional(),
  validatorMiddleware,
];
export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  check("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);

      return true;
    }),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(
      asyncHandler(async (email) => {
        const user = await userModel.findOne({ email });
        if (user) throw new ApiError("Email already exists", 400);
      }),
    ),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number")
    .optional(),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  validatorMiddleware,
];

export const changeUserPasswordValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(
      asyncHandler(async (value, { req }) => {
        const user = await userModel.findById(req.params.id);
        if (!user) throw new ApiError("User not found", 404);
        const isCorrectPassword = await bcrypt.compare(
          req.body.currentPassword,
          user.password,
        );
        if (!isCorrectPassword)
          throw new ApiError("Current password is incorrect", 400);
        if (value !== req.body.confirmPassword)
          throw new ApiError(
            "New password and confirm password do not match",
            400,
          );
        if (value === req.body.currentPassword)
          throw new ApiError(
            "New password must be different from current password",
            400,
          );
        return true;
      }),
    ),
  validatorMiddleware,
];
