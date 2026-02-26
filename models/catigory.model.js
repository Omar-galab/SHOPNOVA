import mongoose from "mongoose";
const { Schema } = mongoose;

const catigorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name of the catigory"],
      unique: [true, "Category name must be unique"],
      minlenth: [3, "Category name must be at least 3 characters"],
      maxlenth: [50, "Category name must be less than 50 characters"],
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
const catigoryModle = mongoose.model("catigory", catigorySchema);

export default catigoryModle;
