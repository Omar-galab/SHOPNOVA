import express from "express";
import {
  createCartOrder,
  getLoggedUserOrders,
  getAllOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../services/order.service.js";
import { createStripeCheckoutSession } from "../services/payment.service.js";
import { protect, allowTo } from "../services/auth.service.js";

const router = express.Router();

//protect ALL routes
router.use(protect);

//Specific routes BEFORE dynamic routes
router.get("/my-orders", allowTo("user"), getLoggedUserOrders);

router.post(
  "/checkout-session/:cartId",
  allowTo("user"),
  createStripeCheckoutSession,
);

router.post("/:cartId", allowTo("user"), createCartOrder);

router.get("/", allowTo("admin"), getAllOrders);

//Dynamic routes LAST
router.get("/:id", allowTo("admin", "user"), getOrder);
router.put("/:id/pay", allowTo("admin"), updateOrderToPaid);
router.put("/:id/deliver", allowTo("admin"), updateOrderToDelivered);

export default router;
