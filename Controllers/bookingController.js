const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dotEnv = require("dotenv");
const AppError = require("../utils/appError");
const Tour = require("../Models/tourModel");
const Booking = require("../Models/Booking");

const catchAsync = require("./../utils/catchAsync");

const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require("./factoryHandler");

dotEnv.config({
    path: "./config.env",
});


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    /**
	* 1 Get currently booked tour;
	* 2 Create checkout session;
	* 3 Create session as response;

 */

    // * 1 Create currently booked tour;

    const tour = await Tour.findById(req.params.tourId);

    //* 2 Create checkout session using STRIPE;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get("host")}/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: tour.price,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },
                quantity: 1,
            },
        ],
        mode: "payment",
    });

    //* Create session as response;

  

    res.status(200).json({
        status: "success",
        session,
    });
});

//! Booking checkout;
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    //* Checks for the queries in the url;
    const { tour, user, price } = req.query;

    /**
     * Checks if the params are there and if not,
     * It moves to the next middleware in the stack.
     * This is the get overview Page;
     */
    if (!tour && !user && !price) return next();

    //Create a new booking/
    await Booking.create({
        tour,
        user,
        price,
    });

    //* Redirects to the overview page after booking
    res.redirect(req.originalUrl.split("?")[0]);
});
