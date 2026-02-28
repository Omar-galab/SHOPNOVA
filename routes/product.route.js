import express from "express";
import {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validator/product.validator.js";

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

export default router;
