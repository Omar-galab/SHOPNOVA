import { param, check } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  validatorMiddleware,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Brand name must be less than 50 characters long"),
  validatorMiddleware,
];
export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  check("name")
    .notEmpty()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Brand name must be less than 50 characters long"),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  validatorMiddleware,
];
