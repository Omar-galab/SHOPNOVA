import express from "express";

import {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setReviewUserIdAndProductId,
} from "../services/review.service.js";
import {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} from "../utils/validator/review.validator.js";
import { protect, allowTo } from "../services/auth.service.js";





const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(protect, allowTo("user"),setReviewUserIdAndProductId, createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowTo("user", "admin"),
    deleteReviewValidator,
    deleteReview,
  );

export default router;
