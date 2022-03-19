const AppError = require("./../utils/appError");

//* Cast Error Message
const sendCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//* MongoDB error Handler
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

//* Mongoose Error Validation.
const sendValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input. ${errors.join(". ")}`;

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
    console.log(err.name);

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    console.log(error);
    //* Message Formats
    if (err.name === "CastError") error = sendCastErrorDB(error);
    /*  if (error.code === 11000) error = handleDuplicateFieldsDB(error); */
    /* if (err.name === "ValidationError") error = sendValidationErrDB(error); */

    sendErrorProd(error, res);
  }
};
