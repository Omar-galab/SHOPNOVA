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
      max: [100000, "Product price must be less than 100000"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [
        0,
        "Product price after discount must be greater than or equal to 0",
      ],
      max: [100000, "Product price after discount must be less than 100000"],
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
    subCategory: [
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
productSchema.pre(/^find/, function () {
  this.populate({ path: "category", select: "name" })
    .populate({ path: "subCategory", select: "name" })
    .populate({ path: "brand", select: "name" });
});

// ✅ Only populate reviews on findOne (single product)
// not on find (list of products) for performance
productSchema.pre("findOne", function () {
  this.populate({ path: "reviews", select: "title text rating user" });
});

const setImageURL = (doc) => {
  // set image URL
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/Products/imageCovers/${doc.imageCover}`;
  }
  if (doc.images && doc.images.length > 0) {
    doc.images = doc.images.map(
      (image) => `${process.env.BASE_URL}/Products/images/${image}`,
    );
  }
};
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

export default mongoose.model("Product", productSchema);
