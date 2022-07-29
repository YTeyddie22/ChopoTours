const Review = require("../Models/Review");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne } = require("./factoryHandler");

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

//! Middleware function for getting IDs
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
//! Create a review per User;
exports.createReview = createOne(Review);

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
