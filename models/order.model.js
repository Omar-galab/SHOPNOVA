import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: [true, "Order must belong to a user"],
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Order must have a product"],
      },
      quantity: {
        type: Number,
        required: [true, "Order must have a quantity"],
      },
      price: {
        type: Number,
        required: [true, "Order must have a price"],
      },
      TaxPrice: Number,
      totalPrice: Number,
      shippingPrice: Number,
      paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        default: "cash",
        required: [true, "Order must have a payment method"],
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      },
      isDelivered: {
        type: Boolean,
        default: false,
      },
      deliveredAt: {
        type: Date,
      },
      shippingAddress: {
        alias: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
      },
    },
  ],
});

export default mongoose.model("Order", orderSchema);
