const express = require("express");

const morgan = require("morgan");

const app = express();

const toursRouter = require("./route/tourRoutes");
const userRouter = require("./route/userRoutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  //! Middleware;
  app.use(express.json());
  app.use(express.static(`${__dirname}/public`));
}

//* Routing middleware

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "Fail";
  err.statusCode = 404;

  next(err);
});

//* Error Middleware

app.use((err, req, res, next) => {
  err.status = err.status || "Fail";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
