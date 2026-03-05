import { param, check, body } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  validatorMiddleware,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long")
    .isLength({ max: 50 })
    .withMessage("Brand name must be less than 50 characters long"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];
export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
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
