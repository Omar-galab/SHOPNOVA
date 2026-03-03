import fs from "fs";
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import brandModel from "../models/brand.model.js";
import { uploadSingleImage } from "../middleware/uploadImage.middleware.js";

import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.js";

export const getBrands = getAll(brandModel);

export const getBrand = getOne(brandModel, "Brand");

export const createBrand = createOne(brandModel);

export const updateBrand = updateOne(brandModel, "Brand");

export const deleteBrand = deleteOne(brandModel, "Brand");

export const resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  // Auto-create folder if not exists
  const dir = "uploads/brands";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${dir}/${fileName}`);

  req.body.image = fileName;

  next();
});

export const uploadBrandImage = uploadSingleImage("image");
