/* eslint-disable import/prefer-default-export */
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const deleteOne = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiError(`${modelName} not found`, 404));
    }
    res.status(204).json(doc);
  });

export const updateOne = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      return next(new ApiError(`${modelName} not found`, 404));
    }
    res.status(200).json(doc);
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  });

export const getOne = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new ApiError(`${modelName} not found`, 404));
    }
    res.status(200).json(doc);
  });
export const getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const countDocuments = await Model.countDocuments(filter);
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .sort()
      .limitFields()
      .search(modelName)
      .filter();
    const { paginationResult, mongooseQuery } = apiFeatures;
    const doc = await mongooseQuery;
    res
      .status(200)
      .json({ results: doc.length, page: paginationResult, data: doc });
  });
