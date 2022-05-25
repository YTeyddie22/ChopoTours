const AppError = require("./../utils/appError");

//* Cast Error Message
function sendCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

//* MongoDB error Handler
function handleDuplicateFieldsDB(err) {
  console.log(err);
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

//* Mongoose Error Validation.
function sendValidationErrDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input. ${errors.join(". ")}`;

  return new AppError(message, 400);
}

//* JsonTokenError

function handleJsonTokenError() {
  return new AppError("Invalid Token Signature, Please login Again", 401);
}
//*Expired Json Token
function handleExpiredTokenError() {
  return new AppError("Token Expired, Please login Again", 401);
}

//! Error function in development

const sendErrorDev = (err, res) => {
  const { status, message, stack, statusCode } = err;

  let errorObj = { errmsg: message, ...err };

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

  const { status, message, stack, statusCode } = err;

  let errorObj = { errmsg: message, ...err };

  if (err.isOperational) {
    res.status(statusCode).json({
      status: status,
      message: message,
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

    let error = Object.create(err);

    if (error.name === "CastError") error = sendCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = sendValidationErrDB(error);
    if (error.name === "JsonWebTokenError") error = handleJsonTokenError(error);
    if (error.name === "TokenExpiredError") error = handleExpiredTokenError();

    sendErrorProd(error, res);
  }
};
