import express from "express";
import { protect, allowTo } from "../services/auth.service.js";
import { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon } from "../services/coupon.service.js";
import { createCouponValidator, updateCouponValidator, deleteCouponValidator } from "../utils/validator/coupon.validator.js";

const router = express.Router();

router.use(protect, allowTo("admin"));

router.post("/", createCouponValidator, createCoupon);
router.get("/", getCoupons);
router.get("/:id", getCoupon);
router.put("/:id", updateCouponValidator, updateCoupon);
router.delete("/:id", deleteCouponValidator, deleteCoupon);

export default router;