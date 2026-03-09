// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import UserModel from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Initialize Stripe lazily so it reads the env var AFTER dotenv.config() runs
const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

// eslint-disable-next-line import/prefer-default-export
export const createStripeCheckoutSession = asyncHandler(
  async (req, res, next) => {
    // Get the user's cart
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiError("Cart not found", 404));
    }

    // Get order price — use discounted price if a coupon was applied
    const cartPrice = cart.totalCartPriceAfterDiscount
      ? cart.totalCartPriceAfterDiscount
      : cart.totalCartPrice;
    const totalPrice = cartPrice + (cart.taxPrice || 0) + (cart.shippingPrice || 0);

    // Create a Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ShopNova Order",
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/api/v1/orders/my-orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
      client_reference_id: req.params.cartId, // Pass the cart ID so we can fulfill the order in webhook
      metadata: {
        shippingAddressId: req.body.shippingAddressId, // Must be an object, not a plain string
      },
    });

    res.status(200).json({
      status: "success",
      sessionUrl: session.url,    // redirect user to this URL to pay
      sessionId: session.id,
      data: {
        session,
      },
    });
  },
);

// Stripe Webhook — fulfil the order after successful payment
export const webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Retrieve the cart using the reference ID stored in the session
    const cart = await Cart.findById(session.client_reference_id);
    if (!cart) return next(new ApiError("Cart not found for webhook", 404));

    // Get the user via email from the Stripe session
    const user = await UserModel.findOne({ email: session.customer_email });
    if (!user) return next(new ApiError("User not found for webhook", 404));

    // Get shipping address from user profile
    const shippingAddress = user.addresses.find(
      (address) =>
        address._id.toString() === session.metadata.shippingAddressId,
    );
    if (!shippingAddress)
      return next(new ApiError("Shipping address not found", 404));

    // Create the order
    const order = await Order.create({
      user: user._id,
      cartItems: cart.cartItems,
      totalPrice: session.amount_total / 100,
      shippingAddress,
      paymentMethod: "card",
      isPaid: true,
      paidAt: Date.now(),
    });

    // Update product quantities and clear cart
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
      await Cart.findByIdAndDelete(cart._id);
    }
  }

  res.status(200).json({ received: true });
});
