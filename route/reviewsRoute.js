const express = require("express");

const {
  getAllReviews,
  getReview,
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

//! Authentication and Authorization
reviewRouter.use(protect);

reviewRouter
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds, createReview);

//Step 2 Authorization
reviewRouter.use(restrictTo("user", "admin"));

reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = reviewRouter;
