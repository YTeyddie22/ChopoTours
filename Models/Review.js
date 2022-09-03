const mongoose = require("mongoose");
const Tour = require("./tourModel");

//! Schema for the model;
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "All tours must have a review"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Reviews must have a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 *! Using compound indexing
 **This is to prevent users' duplication of Reviews;
 */

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/**
 *! Find the user and populating it with reviews;
 */

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

//! Creating a static method;

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //* Start aggregating for solution
  const statistics = await this.aggregate([
    {
      //* To match the id that we are looking for
      $match: { tour: tourId },
    },
    {
      //* Group them by the criteria below while performing calcs
      $group: {
        _id: "$tour",
        numRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  //* Check whether the document has ratings or not;

  if (statistics.length > 0) {
    //* Resolving a promise of the Tour by updating;
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: statistics[0].numRating,
      ratingsAverage: statistics[0].avgRating,
    });
  } else {
    //* Resolving a promise to neutral numbers
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//! This is a post save so it does'nt need next();
reviewSchema.post("save", function () {
  /**
   * *constructor refers to the current model.
   * *(model that has averageRatings function)
   * *It creates a method that calculates the average of the current model;
   */

  this.constructor.calcAverageRatings(this.tour);
});

//! Updating and deleting the tour average ratings and Quantity;
/*
 *Using a regex to identify the FindOne method for either updating or deleting before we save
 * It uses a workaround of updating and deleting the data using the pre and post middleware;
 */

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //* Using this to rep the current data in the model and storing it in the current query variable.

  this.r = await this.findOne().clone();

  next();
});

//* After saving hook that helps in calculating and pushing to the model;
reviewSchema.post(/^findOneAnd/, async function () {
  //* We calculate the statistics for the review;
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

//! Creating the model;
const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
