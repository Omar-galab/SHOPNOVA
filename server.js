import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import catigoryRoute from "./routes/catigory.route.js";
import ApiError from "./utils/apiError.js";
import globalErrorHandler from "./middleware/erorr.middleware.js";

dotenv.config({
  path: "./config.env",
});

const PORT = process.env.PORT || 3000;
// Import database connection
dbConnection();

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Morgan enabled");
}

// Routes

app.use("/api/v1", catigoryRoute);

app.use((req, res, next) => {
  //const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection: ${err.name} - ${err.message}`);
  server.close(() => {
    console.log("Shutting down the server due to Unhandled Rejection");
    process.exit(1);
  });
});
