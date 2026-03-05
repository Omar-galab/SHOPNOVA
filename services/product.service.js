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
import { uploadMixOFImages } from "../middleware/uploadImage.middleware.js";

// eslint-disable-next-line import/prefer-default-export

export const uploadProductImage = uploadMixOFImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const resizeProductImage = asyncHandler(async (req, res, next) => {
  if (!req.files.imageCover) return next();
  // Auto-create folder if not exists
  const dirCover = "uploads/products/imageCovers";
  if (!fs.existsSync(dirCover)) {
    fs.mkdirSync(dirCover, { recursive: true });
  }
  // 1) Process imageCover
  const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${dirCover}/${imageCoverFileName}`);

  req.body.imageCover = imageCoverFileName;

  // 2) Process images
  if (req.files.images) {
    req.body.images = [];
    const dir = "uploads/products/images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await Promise.all(
      //^^^^^^^^^^^ ✅ Use global Promise.all with await
      req.files.images.map(async (img, index) => {
        //              ^^^^^ ✅ Just async, no asyncHandler
        const imageFileName = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${dir}/${imageFileName}`);

        req.body.images.push(imageFileName);
      }),
    );
    console.log(req.body.imageCover);
    console.log(req.body.images);
    next();
  }
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
