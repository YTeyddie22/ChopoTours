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
    getToursWithin,
    getDistances,
    uploadTourImages,
    resizeTourImages,
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

/**
 *? Geospatial Queries
 * * Getting the route for the geospatial query;
 *
 * ?Example {{URL}}api/v1/tours/tours-within/400/center/34.111745,-118.113491/unit/mi;
 */

//* Alternative for specifying a url;

router
    .route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(getToursWithin);

/**
 * ? Creating the route for calculating the distance from user;
 *
 */

router.route("/distances/:latlng/unit/:unit").get(getDistances);

//? Creating a body middleware;
//* Get and Post
router
    .route("/")
    .get(getAllTours)
    .post(protect, restrictTo("admin", "lead-guide"), createTour);

//* Patch,Update,Delete
router
    .route("/:id")
    .get(getTour)
    .patch(
        protect,
        restrictTo("admin", "lead-guide"),
        uploadTourImages,
        resizeTourImages,
        updateTours
    )
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTours);

module.exports = router;
