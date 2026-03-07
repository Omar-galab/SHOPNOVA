import express from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
} from "../services/product.service.js";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validator/product.validator.js";
import { protect, allowTo } from "../services/auth.service.js";
import reviewRouter from "./review.route.js";
const router = express.Router();
router.use("/:productId/reviews", reviewRouter);
router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImage,
    protect,
    allowTo("admin"),
    resizeProductImage,
    createProductValidator,
    createProduct,
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImage,
    protect,
    allowTo("admin"),
    updateProductValidator,
    resizeProductImage,
    updateProduct,
  )
  .delete(protect, allowTo("admin"), deleteProductValidator, deleteProduct);

export default router;
