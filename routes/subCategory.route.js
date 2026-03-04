import express from "express";
import {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setSubCategoryCategoryId,
  createFilterObject,
} from "../services/subCategory.service.js";
import {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} from "../utils/validator/subCategory.validator.js";
import { protect, allowTo } from "../services/auth.service.js";

// This allows the router to access :categoryId
// from the parent router (category route)
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getSubCategories)
  .post(
    protect,
    allowTo("admin"),
    setSubCategoryCategoryId,
    createSubCategoryValidator,
    createSubCategory,
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(protect, allowTo("admin"), updateSubCategoryValidator, updateSubCategory)
  .delete(
    protect,
    allowTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory,
  );

export default router;
