import brandModel from "../models/brand.model.js";

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
