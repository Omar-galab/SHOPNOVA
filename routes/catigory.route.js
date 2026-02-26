import express from "express";
import {
  getCategories,
  creatCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../services/catigory.service.js";

const router = express.Router();

router.get("/catigories", getCategories);

router.get("/catigories/:id", getCategory);

router.post("/catigories", creatCategory);

router.put("/catigories/:id", updateCategory);
router.delete("/catigories/:id", deleteCategory);

export default router;
