const Review = require("../Models/Review");
const catchAsync = require("../utils/catchAsync");

//! Getting all the reviews
exports.getAllReviews = catchAsync(async function (req, res, next) {
  const reviews = await Review.find();

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
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
