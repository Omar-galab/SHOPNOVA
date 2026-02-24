import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/database.js";
import catigoryRoute from "./routes/catigory.route.js";

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

app.use("/api/v1/catigory", catigoryRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
