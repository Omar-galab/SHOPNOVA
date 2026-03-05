
import reviewsModel from "../models/reviews.model.js";


import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.service.js";

// @ desc    Get list of reviews
// @ route   GET /api/v1/reviews
// @ access  Public
export const getReviews = getAll(reviewsModel);

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = getOne(reviewsModel, "Review");

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = createOne(reviewsModel);

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = updateOne(reviewsModel, "Review");
// @desc    Delete review/
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = deleteOne(reviewsModel, "Review");
