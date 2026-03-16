import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name of the category"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [50, "Category name must be less than 50 characters"],
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
// const setImageURL = (doc) => {
//   // set image URL
//   if (doc.image) {
//     doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
//   }
// };
// categorySchema.post("init", (doc) => {
//   setImageURL(doc);
// });
// categorySchema.post("save", (doc) => {
//   setImageURL(doc);
// });
const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
