import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    text: {
      type: String,
      trim: true,
      maxlength: [200, "Text cannot be more than 200 characters"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
      required: [true, "Rating is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.pre(/^find/, async function () {
  this.populate({ path: "user", select: "name profileImage" });
});


reviewSchema.statics.calcAverageRating = async function (productId){
  const result = await this.aggregate([
    {$match: {product: productId}},
    {$group: {_id: "$product", avgRating: {$avg: "$rating"}, ratingCount: {$sum: 1}}}
  ])
  if(result.length > 0){
    await this.model("Product").findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingCount,
    }
  );
  }else{
    await this.model("Product").findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
}

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.product);
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.product);
  }
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.product);
  }
});

export default mongoose.model("Review", reviewSchema);
