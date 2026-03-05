import ApiError from "../utils/apiError.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR", err); // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};
const handelJwtError = () =>
  new ApiError("Invalid token. Please log in again!", 401);
const handelJwtExpiredError = () =>
  new ApiError("Token expired. Please log in again!", 401);

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") return handelJwtError();
    if (err.name === "TokenExpiredError") return handelJwtExpiredError();
    sendErrorProd(err, res);
  }
};
export default globalErrorHandler;
