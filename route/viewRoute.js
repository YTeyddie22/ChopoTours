const express = require("express");
const { getOverview, getTour } = require("../Controllers/viewController");

/**
 * Using express router to manage routes.
 * Using controllers to Render files to routes
 */

const router = express.Router();

router.get("/", getOverview);

//* Slug is a text that will be placed in the URL;
router.get("/tour/:slug", getTour);

module.exports = router;
