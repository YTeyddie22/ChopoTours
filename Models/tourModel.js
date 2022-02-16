const mongoose = require("mongoose");
const slugify = require("slugify");

//Modified Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a Group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "Tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    secretTour: {
      type: Boolean,
      default: false,
    },
    startDates: [Date],
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//! Inserting a virtual property

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//!Adding a document middleware

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//TODO Query Middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (next) {
  console.log("tourSchema Posting a query");
  next();
});

////////////////////////////////////////////////////////////

//!Aggregate schema with a middleWare from mongoose

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { $ne: true } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
