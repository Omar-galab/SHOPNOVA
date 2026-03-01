import asyncHandler from "express-async-handler";
import categoryModel from "../models/category.model.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteOne, updateOne, createOne } from "./handlersFactory.js";

export const getCategories = asyncHandler(async (req, res) => {
  const countDocuments = await categoryModel.countDocuments();

  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate(countDocuments)
    .sort()
    .limitFields()
    .search()
    .filter();

  const { paginationResult, mongooseQuery } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ paginationResult, results: categories.length, data: categories });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json(category);
});

export const createCategory = createOne(categoryModel);

export const updateCategory = updateOne(categoryModel, "Category");

export const deleteCategory = deleteOne(categoryModel, "Category");
