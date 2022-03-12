const mongoose = require("mongoose");
const slugify = require("slugify");

//Modified Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      minLength: [10, "A tour must have more than or 10 characters"],
      maxLength: [40, "A tour must have less than or 40 characters"],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Can be easy, medium, or hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating should be more than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount ({VALUE}) has to be less than the price",
      },
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

///////////////////////////////////////////////////////////
//! Inserting a virtual property

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//!Adding a document middleware

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

////////////////////////////////////////////////////////////

//TODO Query Middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//////////////////////////////////////////////////////////////

//!Aggregate schema with a middleWare from mongoose

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { $ne: true } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
