/* eslint-disable import/first */
import "./config/env.js";
import path from "path";
import express from "express";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import mountRoutes from "./routes/index.js";
import ApiError from "./utils/apiError.js";
import globalErrorHandler from "./middleware/error.middleware.js";

const PORT = process.env.PORT || 3000;
// Import database connection
dbConnection();

const app = express();
app.use(express.static(path.join(path.resolve(), "uploads")));
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Morgan enabled");
}
//routs
mountRoutes(app);

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
