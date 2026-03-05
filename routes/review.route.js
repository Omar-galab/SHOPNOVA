import express from "express";

import {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/review.service.js";
import { createReviewValidator } from "../utils/validator/review.validator.js";
import { protect, allowTo } from "../services/auth.service.js";

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowTo("user"), createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, allowTo("user"), updateReview)
  .delete(protect, allowTo("user", "admin"), deleteReview);

export default router;
