import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { getAll, getOne } from "./handlersFactory.service.js";

// eslint-disable-next-line import/prefer-default-export
export const createCartOrder = asyncHandler(async (req, res, next) => {
  // Get the user's cart
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return next(new ApiError("Cart not found", 404));

  //get order price depending on the cart items and the quantity of each item with the tax and shipping price
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;
  const totalPrice = cartPrice + (cart.taxPrice || 0) + (cart.shippingPrice || 0);

  //get the shipping address from the user profile
  // 3) Get shipping address from user addresses
  const user = await UserModel.findById(req.user._id);
  const shippingAddress = user.addresses.find(
    (address) => address._id.toString() === req.body.shippingAddressId,
  );
  if (!shippingAddress)
    return next(new ApiError("Shipping address not found", 404));

  //create the order with default payment cash

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalPrice,
    shippingAddress,
    paymentMethod: "cash",
    isPaid: false,
  });

  //after creating order update the quantity of each product in the cart and clear the cart
  // 5) Update product quantity & sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(bulkOptions);
    // 6) Clear user's cart
    await Cart.findByIdAndDelete(cart._id);
  }

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

export const getLoggedUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "cartItems.product",
    "name price imageCover",
  );
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});
// Admin can get all orders
export const getAllOrders = getAll(Order);
// Admin can get specific order by id
export const getOrder = getOne(Order, "user");

// Admin can update order to paid or delivered

export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
