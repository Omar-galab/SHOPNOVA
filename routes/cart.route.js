import express from "express";
import {
  addToCart,
  getLoggedUserCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
  applyCouponToCart,
} from "../services/cart.service.js";
import { protect, allowTo } from "../services/auth.service.js";

const router = express.Router();

router.post("/", protect, allowTo("user"), addToCart);
router.get("/", protect, allowTo("user"), getLoggedUserCart);
router.delete("/", protect, allowTo("user"), clearCart);
router.delete("/:itemId", protect, allowTo("user"), removeFromCart);

router.put("/apply-coupon", protect, allowTo("user"), applyCouponToCart);
router.put("/:itemId", protect, allowTo("user"), updateCartItemQuantity);

export default router;
