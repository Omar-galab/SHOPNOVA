import { param, check, body } from "express-validator";
import reviewsModel from "../../models/reviews.model.js";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const getReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review ID"),
  validatorMiddleware,
];

export const createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("product")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID")
    .custom(async (value, { req }) => {
      const review = await reviewsModel.findOne({
        user: req.user._id,
        product: value,
      });
      if (review) {
        throw new Error("You have already reviewed this product");
      }
      return true;
    }),
  validatorMiddleware,
];
export const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID")
    .custom(async (value, { req }) => {
      const review = await reviewsModel.findById(value);
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You can only update your own reviews");
      }
      return true;
    }),

  validatorMiddleware,
];

export const deleteReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review ID").custom(async (value, { req }) => {
    if (req.user.role === "admin") {
      return true; // Admin can delete any review
    }
      const review = await reviewsModel.findById(value);
      if (!review) {
        throw new Error("Review not found");
      }
      
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You can only delete your own reviews");
      }
      return true;
    }),
  validatorMiddleware,
];
