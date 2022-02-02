const express = require("express");

const {
  aliasingTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTours,
  deleteTours,
} = require("./../Controllers/tourController");

//! Checking the Routes;
const router = express.Router();

//! Aliasing Router

router.route(`/top-5-tours`).get(aliasingTopTours,getAllTours)



//! Creating a body middleware;
//* Get and Post
router.route("/").get(getAllTours).post(createTour);

//* Patch,Update,Delete
router.route("/:id").patch(updateTours).get(getTour).delete(deleteTours);

module.exports = router;
