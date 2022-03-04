const express = require("express");

const morgan = require("morgan");

const app = express();

const toursRouter = require("./route/tourRoutes");
const userRouter = require("./route/userRoutes");

const AppError = require("./utils/appError");

const globalErrorController = require("./controllers/errorController");

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
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//* Error Middleware

app.use(globalErrorController);

console.log(app.get("env") === "development");

module.exports = app;
