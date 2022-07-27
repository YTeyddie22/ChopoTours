const express = require("express");

const {
  getAllReviews,
  createReview,
} = require("../Controllers/reviewsController");

const { protect, restrictTo } = require("../Controllers/authController");

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

module.exports = reviewRouter;
