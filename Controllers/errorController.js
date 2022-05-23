const AppError = require("./../utils/appError");

//* Cast Error Message
const sendCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//* MongoDB error Handler
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  console.log(err);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//* Mongoose Error Validation.
const sendValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

//* JsonTokenError

const handleJsonTokenError = () =>
  new AppError("Invalid Token Signature, Please login Again", 401);

//*Expired Json Token
const handleExpiredTokenError = () =>
  new AppError("Token Expired, Please login Again", 401);

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
  //? Development || Production

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //* Message Formats

    let error = { ...err };

    if (err.name === "CastError") error = sendCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = sendValidationErrDB(error);
    if (err.name === "JsonWebTokenError") error = handleJsonTokenError();
    if (err.name === "TokenExpiredError") error = handleExpiredTokenError();

    sendErrorProd(error, res);
  }
};
