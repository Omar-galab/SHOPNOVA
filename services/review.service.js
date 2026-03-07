
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


// @desc    Create filter object for review
// @route   GET /api/v1/reviews
// @access  Public
// nestedRoute
export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
};


// @desc    Set user ID in body
// @route   POST /api/v1/reviews
// @access  Private
export const setReviewUserIdAndProductId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};
