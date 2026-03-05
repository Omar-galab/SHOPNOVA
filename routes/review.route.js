import express from "express";

import {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/review.service.js";
import {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteBrandValidator,
} from "../utils/validator/review.validator.js";
import { protect, allowTo } from "../services/auth.service.js";

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowTo("user"), createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowTo("user", "admin"),
    deleteBrandValidator,
    deleteReview,
  );

export default router;
