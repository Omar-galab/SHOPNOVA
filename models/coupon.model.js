import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Coupon code is required"],
            unique: true,
            trim: true,
        },
        discount: {
            type: Number,
            required: [true, "Discount is required"],
            min: [0, "Discount must be at least 0"],
            max: [100, "Discount must be at most 100"],
        },
        expiresAt: {
            type: Date,
            required: [true, "Expiry date is required"],
        },
        usedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);