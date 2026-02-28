import { param, check } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const getProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
  validatorMiddleware,
];
export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
  validatorMiddleware,
];
export const deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
  validatorMiddleware,
];
export const createProductValidator = [
  //title
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long")
    .isLength({ max: 100 })
    .withMessage("Product title must be less than 100 characters long"),
  //description
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters")
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),
  //quantity
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  // Sold
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  // Price
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0")
    .isFloat({ max: 100000 })
    .withMessage("Price must be less than 100000"),
  // Price After Discount
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price after discount must be positive")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),
  // Colors
  check("colors").optional().isArray().withMessage("Colors must be an array"),
  // Image Cover
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  // Images
  check("images").optional().isArray().withMessage("Images must be an array"),
  // Category
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  // Brand
  check("brand")
    .notEmpty()
    .withMessage("Product brand is required")
    .isMongoId()
    .withMessage("Invalid brand ID"),
  // SubCategory
  check("slubCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID"),
  // Ratings Average
  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  // Ratings Quantity
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),
  validatorMiddleware,
];
