const mongoose = require("mongoose");
const Tour = require("./tourModel")

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
    {//* To match the id that we are looking for
      $match:{tour:tourId}
    },
    {
      //* Group them by the criteria below while performing calcs
      $group:{
        _id:'$tour',
        numRating:{$sum:1},
        avgRating:{$avg:'$rating'}
      }
    }
  ]);


//* Resolving a promise of the Tour by updating;
  await Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:statistics[0].numRating,
    ratingsAverage:statistics[0].avgRating
  })
}

//! This is a post save so it does'nt need next();
reviewSchema.post('save',function(){

  /**
   * *constructor refers to the current model.
   * *(model that has averageRatings function)
   */
  
  this.constructor.calcAverageRatings(this.tour)
})

//! Creating the model;
const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
