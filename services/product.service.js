import productModel from "../models/product.model.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.js";

export const createProduct = createOne(productModel);

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = getAll(
  productModel,
  { path: "category", select: "name" },
  "Product",
);

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = getOne(productModel, "Product", {
  path: "category",
  select: "name",
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = updateOne(productModel, "Product");
// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = deleteOne(productModel, "Product");
