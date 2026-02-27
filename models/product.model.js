import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      unique: [true, "Product title must be unique"],
      minLength: [3, "Product title must be at least 3 characters long"],
      maxLength: [100, "Product title must be less than 100 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [
        20,
        "Product description must be at least 20 characters long",
      ],
      maxLength: [
        2000,
        "Product description must be less than 2000 characters long",
      ],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      min: [0, "Product price must be greater than or equal to 0"],
      maxLength: [20, "Product price must be less than 20characters long"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [
        0,
        "Product price after discount must be greater than or equal to 0",
      ],
      maxLength: [
        20,
        "Product price after discount must be less than 20 characters long",
      ],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Product category is required"],
    },
    slubCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be greater than or equal to 1"],
      max: [5, "Rating must be less than or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
