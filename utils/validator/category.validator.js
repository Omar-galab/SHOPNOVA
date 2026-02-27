import { param, check } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Category name must be less than 50 characters long"),
  validatorMiddleware,
];
export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),
  check("name")
    .notEmpty()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Category name must be less than 50 characters long"),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),
  validatorMiddleware,
];
