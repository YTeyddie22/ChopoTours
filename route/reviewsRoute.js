const express = require("express");

const {
  getAllReviews,
  createReview,
  deleteReview,
} = require("../Controllers/reviewsController");

const { protect, restrictTo } = require("../Controllers/authController");

//! Init the express router with merging params;
const reviewRouter = express.Router({
  mergeParams: true,
});

reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

reviewRouter.route("/:id").delete(deleteReview);

module.exports = reviewRouter;
