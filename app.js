const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const app = express();

const toursRouter = require("./route/tourRoutes");
const userRouter = require("./route/userRoutes");

const AppError = require("./utils/appError");

const globalErrorController = require("./controllers/errorController");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  //! Middleware;

  app.use(express.json());
  // ESLINT error when we write  `S{__dirname/public}`
  app.use(express.static(`${__dirname}/public`));
}

//* Prevents too many requests.
const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Try again after a while",
});

app.use("/api", limiter);
//* Routing middleware

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//* Error Middleware

app.use(globalErrorController);

module.exports = app;
