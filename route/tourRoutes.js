const fs = require('fs');

const express = require('express');

const {
	getAllTours,
	getTour,
	createTour,
	updateTours,
	deleteTours,
} = require('./../Controllers/tourController');

const router = express.Router();

//* Get and Post
router.route('/').get(getAllTours).post(createTour);

//* Patch,Update,Delete
router.route('/:id').patch(updateTours).get(getTour).delete(deleteTours);

module.exports = router;
