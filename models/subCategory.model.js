import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategory must be unique"],
      required: [true, "subCategory name is required"],
      minLength: [2, "subCategory name must be at least 3 characters long"],
      maxLength: [32, "subCategory name must be less than 32 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to a category"],
    },
  },
  { timestamps: true },
);

subCategorySchema.pre(/^find/, function () {
  this.populate({ path: "Category", select: "name" });
});
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
