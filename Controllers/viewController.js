/**
 *Imports
 */
const Tours = require("../Models/tourModel");
const Bookings = require("../Models/Booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

//! Get overview data
exports.getOverview = catchAsync(async (req, res, next) => {
    /**
     * 1. Get data from tour collection
     * 2. Build the template ( To be done in overview page)
     * 3. Render the template using data retrieved.
     */

    //? 1.Get data from Collection

    const tours = await Tours.find();

    res.status(200).render("overview", {
        title: "All Tours",
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    /**
   * 1. Get data for req tour and include reviews and guide.
   * 2. Build the template ( To be done in overview page)
   * 3. Render the template using data retrieved.

   */

    //? 1.Get data from Collection

    const tour = await Tours.findOne({ slug: req.params.slug }).populate({
        path: "review",
        fields: "review rating user",
    });

    if (!tour) {
        return next(new AppError("There is no such tour", 404));
    }

    res.status(200)
        .set(
            "Content-Security-Policy",
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        )
        .render("tour", {
            title: `${tour.name} Tour`,
            tour,
        });
});

//! Login

exports.loginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Log into account",
    });
};

/**
 * TODO ~ SignUp controller
 */

exports.signupForm = (req, res) => {
    res.status(200).render("signup", {
        title: "Sign up",
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your Account",
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    //1 Find all bookings;

    const bookings = await Bookings.find({ user: req.user.id });

    //2 Find tours with returned Ids

    const tourIds = bookings.map((el) => el.tour);

    const tours = await Tours.find({ _id: { $in: tourIds } });

    res.status(200).render("overview", {
        title: "My Bookings",
        tours,
    });
});
