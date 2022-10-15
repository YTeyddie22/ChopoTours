const express = require("express");
const {
  getOverview,
  getTour,
  loginForm,
  getAccount,
} = require("../Controllers/viewController");
const { isLoggedIn, protect } = require("../Controllers/authController");

/**
 * Using express router to manage routes.
 * Using controllers to Render files to routes
 */

const router = express.Router();

router.get("/", isLoggedIn, getOverview);

//* Slug is a text that will be placed in the URL;
router.get("/tour/:slug", isLoggedIn, getTour);

//* Tour Login page

router.get("/login", isLoggedIn, loginForm);

router.get("/me", protect, getAccount);

/**
 * TODO ~  Sign Up Route.
 */

module.exports = router;
