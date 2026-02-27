import slugify from "slugify";
import asyncHandler from "express-async-handler";
import subCategoryModel from "../models/subCategory.model.js";
import ApiError from "../utils/apiError.js";

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
export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json(subCategory);
});

export const getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCategories = await subCategoryModel
    .find(req.filterObject)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name",
    });
  res.status(200).json({
    result: subCategories.length,
    page,
    skip,
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

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
      category,
    },
    { new: true },
  );
  if (!subCategory) {
    return next(new ApiError("subCategory not found", 404));
  }
  res.status(200).json(subCategory);
});

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError("subCategory not found", 404));
  }

  res.status(204).json(subCategory);
});
