import express from "express";
import { addToWishlist, removeFromWishlist, getLoggedUserWishlist } from "../services/wishList.service.js";
import { protect, allowTo } from "../services/auth.service.js";
import { addToWishlistValidator, removeFromWishlistValidator } from "../utils/validator/wishList.validator.js";

const router = express.Router();

router.use(protect, allowTo("user"));
router.post("/", addToWishlistValidator, addToWishlist);
router.get("/", getLoggedUserWishlist);
router.delete("/:productId", removeFromWishlistValidator, removeFromWishlist);

export default router;