const fs = require('fs');

const express = require('express');

const {
	getAllTours,
	getTour,
	createTour,
	updateTours,
	deleteTours,
	checkID,
	checkBody,
} = require('./../Controllers/tourController');

//! Checking the Routes;
const router = express.Router();
router.param('id', checkID);

//! Creating a body middleware;
//* Get and Post
router.route('/').get(getAllTours).post(checkBody, createTour);

//* Patch,Update,Delete
router.route('/:id').patch(updateTours).get(getTour).delete(deleteTours);

module.exports = router;
