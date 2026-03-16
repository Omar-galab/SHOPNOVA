import fs from "fs";
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import productModel from "../models/product.model.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.service.js";
import { uploadMixOFImages , handleUpload } from "../middleware/uploadImage.middleware.js";

// eslint-disable-next-line import/prefer-default-export

export const uploadProductImage = uploadMixOFImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const resizeProductImage = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  // 1)  Upload imageCover to Cloudinary
  if (req.files.imageCover) {
    req.body.imageCover = await handleUpload(
      req.files.imageCover[0], // ← file object
      "products/covers",       // ← folder in Cloudinary
      2000,                    // ← width
      1333,                    // ← height
    );
  }

  // 2) ✅ Upload images array to Cloudinary
  if (req.files.images) {
    req.body.images = await Promise.all(
      req.files.images.map((img) =>
        handleUpload(
          img,              // ← file object
          "products/images", // ← folder in Cloudinary
          800,              // ← width
          800,              // ← height
        )
      )
    );
  }

  next();
});


export const createProduct = createOne(productModel);

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = getAll(productModel);

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = getOne(productModel, "Product");

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = updateOne(productModel, "Product");
// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = deleteOne(productModel, "Product");
