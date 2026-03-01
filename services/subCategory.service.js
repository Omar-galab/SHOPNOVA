import subCategoryModel from "../models/subCategory.model.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.js";

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

export const getSubCategories = getAll(subCategoryModel, {
  path: "category",
  select: "name",
});

export const getSubCategory = getOne(subCategoryModel, "SubCategory", {
  path: "category",
  select: "name",
});

export const updateSubCategory = updateOne(subCategoryModel, "SubCategory");

export const deleteSubCategory = deleteOne(subCategoryModel, "SubCategory");
