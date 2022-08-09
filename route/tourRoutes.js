const express = require("express");

const {
  aliasingTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTours,
  deleteTours,
  getTourStats,
  getMonthlyPlan,
} = require("./../Controllers/tourController");

const { protect, restrictTo } = require("./../Controllers/authController");

const reviewRouter = require("./reviewsRoute");

//! Checking the Routes;
const router = express.Router();

//*Implementing the merge routing to reviews;

router.use("/:tourId/reviews", reviewRouter);

//! Aliasing Router

router.route(`/top-5-cheap`).get(aliasingTopTours, getAllTours);

//!Aggregation Pipelining

router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

//! Creating a body middleware;
//* Get and Post
router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);

//* Patch,Update,Delete
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTours)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTours);

module.exports = router;
