import express from "express";

import {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} from "../services/category.service.js";
import { protect, allowTo } from "../services/auth.service.js";
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validator/category.validator.js";

import subCategoryRoute from "./subCategory.route.js";

const router = express.Router();
// 👇 Nested Route - Forward to subCategory router
router.use("/:categoryId/subcategories", subCategoryRoute);
//           ^^^^^^^^^^^^
//           Uses categoryId (not id)

// 👇 Clean routes (no need to repeat /categories)
router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    protect,
    allowTo("admin"),
    createCategoryValidator,
    resizeCategoryImage,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    protect,
    allowTo("admin"),
    updateCategoryValidator,
    resizeCategoryImage,
    updateCategory,
  )
  .delete(protect, allowTo("admin"), deleteCategoryValidator, deleteCategory);

export default router;
