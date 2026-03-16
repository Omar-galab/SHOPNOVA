// eslint-disable-next-line import/no-extraneous-dependencies
import asyncHandler from "express-async-handler";
import categoryModel from "../models/category.model.js";
import {
  uploadSingleImage,
  handleUpload,
} from "../middleware/uploadImage.middleware.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.service.js";

//  Resize and upload to Cloudinary
export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  //  Upload to Cloudinary with 600x600 size
  req.body.image = await handleUpload(
    req.file,
    "categories", // ← folder in Cloudinary
    600, // ← width
    600, // ← height
  );

  next();
});
export const getCategories = getAll(categoryModel);

export const getCategory = getOne(categoryModel, "Category");

export const createCategory = createOne(categoryModel);

export const updateCategory = updateOne(categoryModel, "Category");

export const deleteCategory = deleteOne(categoryModel, "Category");

export const uploadCategoryImage = uploadSingleImage("image");
