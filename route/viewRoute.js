const express = require("express");
const { getOverview, getTour } = require("../Controllers/viewController");

/**
 * Using express router to manage routes.
 * Using controllers to Render files to routes
 */

const router = express.Router();

router.get("/", getOverview);

router.get("/tour", getTour);

module.exports = router;
