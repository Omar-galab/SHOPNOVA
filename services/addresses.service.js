import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";


// @desc    Add address to addresses
// @route   POST /api/v1/addresses
// @access  Private (User)
export const addAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $push: { addresses: req.body },
    },
    {
    returnDocument: "after",
      runValidators: true,
    }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});

export const getAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});

export const removeAdress = asyncHandler(async (req, res, next) => {

    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { addresses: { _id: req.params.addressId } },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
    if (!user) {
        return next(new ApiError("User not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: user.addresses,
    });
    
})

export const updateAddress = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: { addresses: { _id: req.params.addressId, ...req.body } },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
    if (!user) {
        return next(new ApiError("User not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: user.addresses,
    });
})
