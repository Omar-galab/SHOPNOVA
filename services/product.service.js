import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { json } from "express";
import productModel from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteOne, updateOne, createOne } from "./handlersFactory.js";

export const createProduct = createOne(productModel);

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const countDocuments = await productModel.countDocuments();
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .search("Product")
    .paginate(countDocuments);
  const { paginationResult, mongooseQuery } = apiFeatures;
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ paginationResult, results: products.length, data: products });
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
export const updateProduct = updateOne(productModel, "Product");
// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = deleteOne(productModel, "Product");
