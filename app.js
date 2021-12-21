const express = require("express");

const morgan = require("morgan");

const app = express();

const toursRouter = require("./route/tourRoutes");
const userRouter = require("./route/userRoutes");

//! Middleware;
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

//! Listening to the port;

module.exports = app;
