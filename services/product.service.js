import slugify from "slugify";
import asyncHandler from "express-async-handler";
import productModel from "../models/product.model.js";
import ApiError from "../utils/apiError.js";

export const createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await productModel
    .find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });
  res
    .status(200)
    .json({ results: products.length, page, skip, data: products });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate({ path: "category", select: "name" });
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json(product);
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json(product);
});
// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(204).json(product);
});
