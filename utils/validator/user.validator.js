import { param, check, body } from "express-validator";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
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

  validatorMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  validatorMiddleware,
];
