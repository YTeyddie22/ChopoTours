const express = require("express");

const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  setTourUserIds,
} = require("../Controllers/reviewsController");

const { protect, restrictTo } = require("../Controllers/authController");

//! Init the express router with merging params;
const reviewRouter = express.Router({
  mergeParams: true,
});

reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourUserIds, createReview);

reviewRouter.route("/:id").patch(updateReview).delete(deleteReview);

module.exports = reviewRouter;
