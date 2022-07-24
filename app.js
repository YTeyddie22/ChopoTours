//? Packages
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();

//? Routers
const toursRouter = require("./route/tourRoutes");
const userRouter = require("./route/userRoutes");

//? Global Error
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");

//! Set security Headers;

app.use(helmet());

//! Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//! Prevents too many requests.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Try again after a while",
});

app.use("/api", limiter);

//! BodyParsing Middleware;

app.use(express.json({ limit: "10kb" }));

//! Implement sanitization in the body;

//* Against NOSQL injection
app.use(mongoSanitize());

//*Against Xss;
app.use(xss());

//* Against parameter pollution;

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//! ESLINT error when we write  `S{__dirname/public}`
//* For a static web
app.use(express.static(`${__dirname}/public`));

//! Routing middleware
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//* Error Middleware

app.use(globalErrorController);

module.exports = app;
