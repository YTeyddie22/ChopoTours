//! Error function in development

//TODO

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
    //? For The programming bugs

    console.error("Error ⌛ ", err);
    res.status(500).json({
      status: "Error ",
      message: "Something went Terrible",
    });
  }
};

//* Exporting the Errors either in production || development mode

module.exports = (err, req, res, next) => {
  //? Development ||| Production

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
