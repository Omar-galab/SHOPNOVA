import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email must be unique"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      lowercase: true,
    },
    phone: {
      type: String,
    },
    profileImage: String,

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});
const setImageURL = (doc) => {
  // set image URL
  if (doc.profileImage) {
    doc.profileImage = `${process.env.BASE_URL}/users/${doc.profileImage}`;
  }
};

userSchema.post("init", (doc) => {
  setImageURL(doc);
});
userSchema.post("save", (doc) => {
  // set image URL
  setImageURL(doc);
});

export default mongoose.model("UserModel", userSchema);
