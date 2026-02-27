import slugify from "slugify";
import asyncHandler from "express-async-handler";
import brandModel from "../models/brand.model.js";
import ApiError from "../utils/apiError.js";

export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json(brand);
});

export const getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await brandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, skip, data: brands });
});

export const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json(brand);
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findByIdAndUpdate(
    id,
    {
      name,
      slug: slugify(name),
    },
    { new: true },
  );
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json(brand);
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(204).json(brand);
});
