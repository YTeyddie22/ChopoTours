//! Packages
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
    //* Each location has a start location
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    //* There is an array of locations which are objects containing strings and array of coordinates
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
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

//* Virtual property to populate

tourSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});

//!Adding a document middleware

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//! Adding a save middleware for embedding data;
/*
tourSchema.pre("save", async function (next) {
  const guidePromise = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidePromise);
  next();
});
*/

////////////////////////////////////////////////////////////

//! Query Middlewares

//! Populating the guides data;

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});

//* Tour that is not a secret tour
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

//////////////////////////////////////////////////////////

//! query middleware for post data;

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//////////////////////////////////////////////////////////////

//!Aggregate schema with a middleWare from mongoose

//* Remove tour that doesn't match;
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { $ne: true } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
