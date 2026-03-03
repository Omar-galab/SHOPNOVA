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

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, createBrandValidator, resizeBrandImage, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, updateBrandValidator, resizeBrandImage, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
