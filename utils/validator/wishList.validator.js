import { param, check, body } from "express-validator";
import ApiError from "../../utils/apiError.js";
import validatorMiddleware from "../../middleware/validator.middleware.js";
import productModel from "../../models/product.model.js";

export const addToWishlistValidator = [
    body("productId")
        .isMongoId()
        .withMessage("Invalid product ID")
        .custom((value) => {
            return productModel.findById(value).then((product) => {
                if (!product) {
                    return Promise.reject(new Error("Product not found"));
                }
            });
        }),
    validatorMiddleware,
];
export const removeFromWishlistValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID")
        .custom((value) => {
            return productModel.findById(value).then((product) => {
                if (!product) {
                    return Promise.reject(new Error("Product not found"));
                }
            });
        }),
    validatorMiddleware,
];
