import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.js";
import ApiError from "../utils/apiError.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";

//  @desc    Add product to cart
//  @route   POST /api/v1/cart
//  @access  Private/User
// eslint-disable-next-line import/prefer-default-export
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError("Product not found", 404));

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: product._id,
          color,
          quantity: quantity || 1,
          price: product.price,
        },
      ],
      totalCartPrice: product.price * (quantity || 1),
    });
  } else {
    const itemIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId &&
        //  Handle undefined color comparison
        (item.color || null) === (color || null),
    );

    if (itemIndex > -1) {
      //  Update quantity
      cart.cartItems[itemIndex].quantity += quantity || 1;
    } else {
      //  Add new item
      cart.cartItems.push({
        product: product._id,
        color,
        quantity: quantity || 1,
        price: product.price,
      });
    }

    cart.totalCartPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    await cart.save();
  }

  res.status(200).json({
    message: "Product added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

export const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return next(new ApiError("No cart found for this user", 404));

  res.status(200).json({
    message: "Cart retrieved successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
//  @desc    Remove product from cart
//  @route   DELETE /api/v1/cart/:itemId
//  @access  Private/User
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    {
      new: true,
    },
  );
  if (!cart) return next(new ApiError("No cart found for this user", 404));
  cart.totalCartPrice = cart.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  await cart.save();
  res.status(200).json({
    message: "Product removed from cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
//  @desc    Clear cart
//  @route   DELETE /api/v1/cart
//  @access  Private/User
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) return next(new ApiError("No cart found for this user", 404));
  res.status(200).json({
    message: "Cart cleared successfully",
    data: null,
  });
});
//  @desc    Update cart item quantity
//  @route   PUT /api/v1/cart/:itemId
//  @access  Private/User
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("No cart found for this user", 404));
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId,
  );
  if (itemIndex === -1) return next(new ApiError("Cart item not found", 404));
  cart.cartItems[itemIndex].quantity = quantity;
  cart.totalCartPrice = cart.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  await cart.save();
  res.status(200).json({
    message: "Cart item quantity updated successfully",
    data: cart,
  });
});

//  @desc    Apply coupon to cart
//  @route   POST /api/v1/cart/apply-coupon
//  @access  Private/User
export const applyCouponToCart = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    code: req.body.couponCode,
    expiresAt: { $gt: new Date() },
  });
  if (!coupon) return next(new ApiError("Invalid or expired coupon", 400));
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("No cart found for this user", 404));
  cart.coupon = coupon._id;
  cart.totalCartPriceAfterDiscount =
    cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100;
  await cart.save();
  res.status(200).json({
    message: "Coupon applied successfully",
    data: cart,
  });
});
