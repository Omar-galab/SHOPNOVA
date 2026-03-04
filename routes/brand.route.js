import express from "express";

import {
  getBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} from "../services/brand.service.js";

import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validator/brand.validator.js";
import { protect, allowTo } from "../services/auth.service.js";

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    uploadBrandImage,
    protect,
    allowTo("admin"),
    createBrandValidator,
    resizeBrandImage,
    createBrand,
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    uploadBrandImage,
    protect,
    allowTo("admin"),
    updateBrandValidator,
    resizeBrandImage,
    updateBrand,
  )
  .delete(protect, allowTo("admin"), deleteBrandValidator, deleteBrand);

export default router;
