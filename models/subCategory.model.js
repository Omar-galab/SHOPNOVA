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
      ref: "category",
      required: [true, "subCategory must belong to a category"],
    },
  },
  { timestamps: true },
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
