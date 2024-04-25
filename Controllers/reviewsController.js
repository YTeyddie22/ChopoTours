//const catchAsync = require("../utils/catchAsync");

const Review = require("../Models/Review");
const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require("./factoryHandler");

//! Getting all the reviews

//! Middleware function for getting IDs
exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

//! Create, Get, Update and delete methods for reviews;
exports.createReview = createOne(Review);

exports.getAllReviews = getAll(Review);

exports.getReview = getOne(Review);

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
