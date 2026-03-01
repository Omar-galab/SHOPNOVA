import categoryModel from "../models/category.model.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.js";

export const getCategories = getAll(categoryModel);

export const getCategory = getOne(categoryModel, "Category");

export const createCategory = createOne(categoryModel);

export const updateCategory = updateOne(categoryModel, "Category");

export const deleteCategory = deleteOne(categoryModel, "Category");
