const AppError = require("./../utils/appError");

//* Cast Error Message
const sendCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//! Error function in development

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//! Error function in production

const sendErrorProd = (err, res) => {
  //? For The Client invalidation

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

//* Exporting the Errors either in production || development mode

module.exports = (err, req, res, next) => {
  //? Development ||| Production

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    //* Message Formats
    if (err.name === "CastError") error = sendCastErrorDB(error);

    sendErrorProd(error, res);
  }
};
