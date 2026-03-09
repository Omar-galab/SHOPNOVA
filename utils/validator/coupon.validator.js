import { check, body } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const createCouponValidator = [
    body("code")
        .notEmpty()
        .withMessage("Coupon code is required")
        .isString()
        .withMessage("Coupon code must be a string")
        .trim(),
    body("discount")
        .notEmpty()
        .withMessage("Discount is required")
        .isNumeric()
        .withMessage("Discount must be a number")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100"),
    body("expiresAt")
        .notEmpty()
        .withMessage("Expiry date is required")
        .isISO8601()
        .withMessage("Expiry date must be a valid date"),
    validatorMiddleware,
];

export const updateCouponValidator = [
    check("id")
        .notEmpty()
        .withMessage("Coupon ID is required")
        .isMongoId()
        .withMessage("Invalid coupon ID format"),
    body("code")
        .optional()
        .isString()
        .withMessage("Coupon code must be a string")
        .trim(),
    body("discount")
        .optional()
        .isNumeric()
        .withMessage("Discount must be a number")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100"),
    body("expiresAt")
        .optional()
        .isISO8601()
        .withMessage("Expiry date must be a valid date"),
    validatorMiddleware,
];

export const deleteCouponValidator = [
    check("id")
        .notEmpty()
        .withMessage("Coupon ID is required")
        .isMongoId()
        .withMessage("Invalid coupon ID format"),
    validatorMiddleware,
];