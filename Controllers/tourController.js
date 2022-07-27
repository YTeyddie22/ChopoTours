const Tour = require("./../Models/tourModel");

const ApiFeatures = require("./../utils/apiFeatures.js");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//! Get aliasingTopTours

exports.aliasingTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

//! Get all tours method;
exports.getAllTours = catchAsync(async (req, res, next) => {
  // * Object containing all the functions from the ApiFeature Class
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();

  const tours = await features.query;

  res.status(200).json({
    status: "success",

    result: tours.length,
    data: {
      tours,
    },
  });
});

//! Get specific tour  method;
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate("reviews");

  if (!tour) return next(new AppError(`No tour found with id`, 404));

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

//! Post method;

exports.createTour = catchAsync(async (req, res, next) => {
  //* awaiting the promise;

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

//! Update tour method;

exports.updateTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,

    runValidators: true,
  });

  if (!tour) return next(new AppError(`Cannot update tour`, 404));

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

//!  Delete Tour method;

exports.deleteTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError(`No tour found with id`, 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//! Get Tour Stats
exports.getTourStats = catchAsync(async (req, res, next) => {
  //* Aggregation pipelining with Mongoose/MongoDb
  const tourStats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        tourNum: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: tourStats,
  });
});

//!  Business logic to get highest number of tours in the Months
exports.getMonthlyPlan = catchAsync(async function (req, res, next) {
  //* Convert year to numbers

  const year = +req.params.year;

  //*Aggregation process

  const plan = await Tour.aggregate([
    //For destructuring and getting the dates
    {
      $unwind: "$startDates",
    },

    //For matching and relating to whether it is gte or lte to the dates
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    //Grouping id, number of tours and name of the tours
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStart: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    // Adding the field of months that will replace the _id field
    {
      $addFields: { month: "$_id" },
    },

    // Delete the _id field
    {
      $project: {
        _id: 0,
      },
    },

    // Sort the data according to the number of tours in descending format
    { $sort: { numTourStart: -1 } },
  ]);
  res.status(200).json({
    status: "success",
    data: plan,
  });
});
