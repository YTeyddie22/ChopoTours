const AppError = require("./../utils/appError");

//* Cast Error Message
function sendCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

//* MongoDB error Handler
function handleDuplicateFieldsDB(err) {
  /* const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400); */

  console.log(err);
}

//* Mongoose Error Validation.
function sendValidationErrDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input. ${errors.join(". ")}`;

  return new AppError(message, 400);
}

//* JsonTokenError

function handleJsonTokenError() {
  console.log("Found Error");
  return new AppError("Invalid Token Signature, Please login Again", 401);
}
//*Expired Json Token
function handleExpiredTokenError() {
  return new AppError("Token Expired, Please login Again", 401);
}

//! Error function in development

const sendErrorDev = (err, res) => {
  const { status, message, stack, statusCode } = err;

  let errorObj = { errmsg: err.message, ...err };

  res.status(statusCode).json({
    status: status,
    error: errorObj,
    message: message,
    stack: stack,
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

    if (error.name === "CastError") error = sendCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = sendValidationErrDB(error);
    if (error.name === "JsonWebTokenError") error = handleJsonTokenError();
    if (error.name === "TokenExpiredError") error = handleExpiredTokenError();

    sendErrorProd(error, res);
  }
};
