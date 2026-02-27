import { param, check } from "express-validator";

import validatorMiddleware from "../../middleware/validator.middleware.js";

export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory ID"),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("Subcategory name must be less than 32 characters long"),
  check("category")
    .notEmpty()
    .withMessage("category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid subcategory ID")
    .notEmpty()
    .withMessage("Subcategory ID is required"),
  validatorMiddleware,
];
export const deleteSubCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid subcategory ID")
    .notEmpty()
    .withMessage("Subcategory ID is required"),
  validatorMiddleware,
];
