import slugify from "slugify";
import asyncHandler from "express-async-handler";
import categoryModel from "../models/category.model.js";
import ApiError from "../utils/apiError.js";

export const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const categories = await categoryModel.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ results: categories.length, page, skip, data: categories });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json(category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await categoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!category) {
    return next(new ApiError("category not found", 404));
  }
  res.status(200).json(category);
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("category not found", 404));
  }
  res.status(204).json(category);
});
