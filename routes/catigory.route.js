import express from "express";
import {
  getCategories,
  creatCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../services/catigory.service.js";
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validator/catigory.validator.js";

const router = express.Router();

router.get("/catigories", getCategories);

router.get("/catigories/:id", getCategoryValidator, getCategory);

router.post("/catigories", createCategoryValidator, creatCategory);

router.put("/catigories/:id", updateCategoryValidator, updateCategory);
router.delete("/catigories/:id", deleteCategoryValidator, deleteCategory);

export default router;
