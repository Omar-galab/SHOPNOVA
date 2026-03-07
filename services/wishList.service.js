import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

export const addToWishlist = asyncHandler(async(req , res)=>{
    const  user = await UserModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId },
    }, {returnDocument: "after"})
    if(!user){
        throw new ApiError("User not found", 404);
    }
    res.status(200).json({status: "success", message: "Product added to wishlist", data: user.wishlist });
});

export const removeFromWishlist = asyncHandler(async(req , res)=>{
    const  user = await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId },
    }, {returnDocument: "after"})
    if(!user){
        throw new ApiError("User not found", 404);
    }
    res.status(200).json({status: "success", message: "Product removed from wishlist", data: user.wishlist });
})

export const getLoggedUserWishlist = asyncHandler(async(req , res)=>{
    const user = await UserModel.findById(req.user._id).populate("wishlist");
    if(!user){
        throw new ApiError("User not found", 404);
    }
    res.status(200).json({status: "success", data: user.wishlist });
})