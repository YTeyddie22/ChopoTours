const express = require("express");
const { getCheckoutSession } = require("../Controllers/bookingController");
const { protect } = require("../Controllers/authController");

const router = express.Router();

router.get("/checkout-session/:tourId", protect, getCheckoutSession);

module.exports = router;
