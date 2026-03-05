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

export const getOne = (Model, modelName , populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new ApiError(`${modelName} not found`, 404));
    }
    res.status(200).json(doc);
  });
export const getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
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
