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

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} in this server`,
  });
});

module.exports = app;
