//? Packages
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const cookieParser = require("cookie-parser");

//? Modules;

//? Routers
const toursRouter = require("./route/tourRoutes");
const userRouter = require("./route/userRoutes");
const reviewRouter = require("./route/reviewsRoute");
const viewRouter = require("./route/viewRoute");

//? Global Error
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/errorController");

const app = express();

/**
 * ? Setting up the view engine;( PUG);
 * * Creating the path for the files used by the engine;
 */

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

//! ESLINT error when we write  `S{__dirname/public}`
/**
 *?  For a static web
 ** Alternative: app.use(express.static(`${__dirname}/public`));
 */
app.use(express.static(path.join(__dirname, "public")));

//! Set security Headers;
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

//! Logging middleware
//? TODO, MORGAN NOT LOGGING
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

//! For parsing cookies

app.use(cookieParser());

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

//! Test middleware;

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

/**
 * ? Rendering PUG
 * ! Routing middleware
 */

app.use("/", viewRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//* Error Middleware

app.use(globalErrorController);

module.exports = app;
