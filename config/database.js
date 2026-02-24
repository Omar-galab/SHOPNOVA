import e from "express";
import mongoose from "mongoose";
const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database connection error: ${err}`);
      process.exit(1);
    });
};
export default dbConnection;
