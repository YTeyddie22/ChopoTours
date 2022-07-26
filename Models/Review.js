const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    reviews: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tours: {
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

const reviewModel = mongoose.model("Reviews", ReviewSchema);

module.export = reviewModel;
