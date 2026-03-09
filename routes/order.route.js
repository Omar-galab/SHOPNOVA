import express from "express";
import {
  createCartOrder,
  getLoggedUserOrders,
  getAllOrders,
  getOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
} from "../services/order.service.js";
import { protect, allowTo } from "../services/auth.service.js";

const router = express.Router();
router.get("/", allowTo("admin"), getAllOrders);
router.use(protect, allowTo("user"));
router.post("/:cartId", createCartOrder);
router.get("/my-orders", getLoggedUserOrders);
router.get("/:id", getOrder);
router.put("/:id/pay", allowTo("admin"), updateOrderToPaid);
router.put("/:id/deliver", allowTo("admin"), updateOrderToDelivered);

export default router;
