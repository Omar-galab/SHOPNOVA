import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handlersFactory.service.js";
import Coupon from "../models/coupon.model.js";



//@desc Create coupon
//@route POST /api/v1/coupons
//@access Private
export const createCoupon = createOne(Coupon);

//@desc Get all coupons
//@route GET /api/v1/coupons
//@access Private
export const getCoupons = getAll(Coupon);

//@desc Get coupon
//@route GET /api/v1/coupons/:id
//@access Private
export const getCoupon = getOne(Coupon);

//@desc Update coupon
//@route PUT /api/v1/coupons/:id
//@access Private
export const updateCoupon = updateOne(Coupon);

//@desc Delete coupon
//@route DELETE /api/v1/coupons/:id
//@access Private
export const deleteCoupon = deleteOne(Coupon);

