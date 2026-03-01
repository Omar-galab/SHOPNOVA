import asyncHandler from "express-async-handler";
import subCategoryModel from "../models/subCategory.model.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteOne, updateOne, createOne } from "./handlersFactory.js";

export const setSubCategoryCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
export const createSubCategory = createOne(subCategoryModel);

export const getSubCategories = asyncHandler(async (req, res) => {
  const countDocuments = await subCategoryModel.countDocuments(
    req.filterObject,
  );
  const apiFeatures = new ApiFeatures(
    subCategoryModel.find(req.filterObject),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .search("SubCategory")
    .paginate(countDocuments);
  const { paginationResult, mongooseQuery } = apiFeatures;

  const subCategories = await mongooseQuery.populate({
    path: "category",
    select: "name",
  });
  res.status(200).json({
    result: subCategories.length,
    page: paginationResult,
    data: subCategories,
  });
});

export const getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!subCategory) {
    return next(new ApiError("subCategory not found", 404));
  }
  res.status(200).json(subCategory);
});

export const updateSubCategory = updateOne(subCategoryModel, "SubCategory");

export const deleteSubCategory = deleteOne(subCategoryModel, "SubCategory");
