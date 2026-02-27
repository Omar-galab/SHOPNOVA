import express from "express";
import {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";
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
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
