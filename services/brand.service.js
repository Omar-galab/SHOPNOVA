import asyncHandler from "express-async-handler";
import brandModel from "../models/brand.model.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteOne, updateOne, createOne } from "./handlersFactory.js";

export const getBrands = asyncHandler(async (req, res) => {
  const countDocuments = await brandModel.countDocuments();
  const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate(countDocuments)
    .sort()
    .limitFields()
    .search()
    .filter();
  const { paginationResult, mongooseQuery } = apiFeatures;
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ paginationResult, results: brands.length, data: brands });
});

export const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiError("Brand not found", 404));
  }
  res.status(200).json(brand);
});
export const createBrand = createOne(brandModel);

export const updateBrand = updateOne(brandModel, "Brand");

export const deleteBrand = deleteOne(brandModel, "Brand");
