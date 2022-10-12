const express = require("express");
const {
  getOverview,
  getTour,
  loginForm,
} = require("../Controllers/viewController");
const { isLoggedIn } = require("../Controllers/authController");

/**
 * Using express router to manage routes.
 * Using controllers to Render files to routes
 */

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getOverview);

//* Slug is a text that will be placed in the URL;
router.get("/tour/:slug", getTour);

//* Tour Login page

router.get("/login", loginForm);

module.exports = router;
