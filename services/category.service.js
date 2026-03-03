
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import categoryModel from "../models/category.model.js";
import { uploadSingleImage } from "../middleware/uploadImage.middleware.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.js";




export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  req.body.image = fileName;

  next();
});
export const getCategories = getAll(categoryModel);

export const getCategory = getOne(categoryModel, "Category");

export const createCategory = createOne(categoryModel);

export const updateCategory = updateOne(categoryModel, "Category");

export const deleteCategory = deleteOne(categoryModel, "Category");

export const uploadCategoryImage = uploadSingleImage("image");
