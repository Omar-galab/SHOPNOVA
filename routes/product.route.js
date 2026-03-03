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

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    createProduct,
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImage,
    updateProductValidator,
    resizeProductImage,
    updateProduct,
  )
  .delete(deleteProductValidator, deleteProduct);

export default router;
