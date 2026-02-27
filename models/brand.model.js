import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minLength: [3, "Brand name must be at least 3 characters long"],
      maxLength: [32, "Brand name must be less than 32 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  },
);


export default mongoose.model("Brand", brandSchema);
