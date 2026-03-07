import categoryRoute from "./category.route.js";
import subCategoryRoute from "./subCategory.route.js";
import brandRoute from "./brand.route.js";
import productRoute from "./product.route.js";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import reviewRoute from "./review.route.js";
import wishlistRoute from "./wishList.route.js";
import addressesRoute from "./adresses.route.js";
import couponRoute from "./coupon.route.js";

const mountRoutes = (app) => {
    // Routes
app.set("query parser", "extended");
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/address", addressesRoute); 
app.use("/api/v1/coupons", couponRoute); 
}

export default mountRoutes;