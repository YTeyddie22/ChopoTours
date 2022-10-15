const AppError = require("./../utils/appError");

//* Cast Error Message
function sendCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

//* MongoDB error Handler
function handleDuplicateFieldsDB(err) {
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

/**
 * ! Error function in Development
 */

const sendErrorDev = (err, req, res) => {
  const { status, message, stack, statusCode } = err;
  /**
   ** For The API (DEV)
   */
  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
      status,
      error: err,
      message,
      stack,
    });
  }

  console.error("ERROR 💥", err);

  /**
   ** For The Rendered Website (DEV)
   */
  return res.status(statusCode).render("error", {
    title: "Something Is wrong!",
    msg: message,
  });
};

/**
 * ! Error function in production
 */

const sendErrorProd = (err, req, res) => {
  //? For The Client invalidation

  const { status, message, statusCode } = err;

  /**
   ** For The API
   */

  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(statusCode).json({
        status,
        message,
      });
    }

    // 1) Log error

    console.error("ERROR 💥", err);

    // 2) Send generic message

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  /**
   ** For The Rendered Website
   */

  if (err.isOperational) {
    return res.status(statusCode).render("error", {
      title: "Something Is wrong",
      msg: message,
    });
  }

  // 1) Log error

  console.error("ERROR 💥", err);

  // 2) Send generic message

  return res.status(statusCode).render("error", {
    title: "Something went terrible",
    msg: "Please try again some other time",
  });
};

//* Exporting the Errors either in production || development mode

module.exports = (err, req, res, next) => {
  //? Development || Production

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    //* Message Formats

    let error = Object.create(err);

    if (error.name === "CastError") error = sendCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = sendValidationErrDB(error);
    if (error.name === "JsonWebTokenError") error = handleJsonTokenError(error);
    if (error.name === "TokenExpiredError") error = handleExpiredTokenError();

    sendErrorProd(error, req, res);
  }
};
