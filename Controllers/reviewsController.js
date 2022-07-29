const Review = require("../Models/Review");
const catchAsync = require("../utils/catchAsync");
const { deleteOne } = require("./factoryHandler");

//! Getting all the reviews
exports.getAllReviews = catchAsync(async function (req, res, next) {
  let filter = {};

  if (req.params.tourId)
    filter = {
      tour: req.params.tourId,
    };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

//! Create a review per User;
exports.createReview = catchAsync(async function (req, res, next) {
  //* Check whether the tour and user are present;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.deleteReview = deleteOne(Review);
