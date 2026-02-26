import { json } from "express";
import catigoryModle from "../models/catigory.model.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import { Query } from "mongoose";
import ApiError from "../utils/apiError.js";

export const getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const catigorys = await catigoryModle.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ results: catigorys.length, page, skip, data: catigorys });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await catigoryModle.findById(id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  } else {
    res.status(200).json(category);
  }
});

export const creatCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const catigory = await catigoryModle.create({
    name,
    slug: slugify(name),
  });
  res.status(201).json(catigory);
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name;
  const category = await catigoryModle.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!category) {
    return next(new ApiError("category not found", 404));
  } else {
    res.status(200).json(category);
  }
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await catigoryModle.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("category not found", 404));
  } else {
    res.status(204).json(category);
  }
});
