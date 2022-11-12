const express = require("express");
const {
  getOverview,
  getTour,
  loginForm,
  signupForm,
  getAccount,
  getMyTours,
} = require("../Controllers/viewController");
const {
  isLoggedIn,
  protect,
  signup,
} = require("../Controllers/authController");

const { createBookingCheckout } = require("../Controllers/bookingController");

/**
 * Using express router to manage routes.
 * Using controllers to Render files to routes
 */

const router = express.Router();

router.get("/", createBookingCheckout, isLoggedIn, getOverview);

//* Slug is a text that will be placed in the URL;
router.get("/tour/:slug", isLoggedIn, getTour);

//* Tour Login page

router.get("/login", isLoggedIn, loginForm);
router.get("/signup", signup, signupForm);

router.get("/me", protect, getAccount);

router.get("/my-bookings", protect, getMyTours);

/**
 * TODO ~  Sign Up Route.
 */

module.exports = router;
