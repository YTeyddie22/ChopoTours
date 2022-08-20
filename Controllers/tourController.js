//const AppError = require("./../utils/appError");

const Tour = require("./../Models/tourModel");

const catchAsync = require("./../utils/catchAsync");

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./factoryHandler");

//! Get aliasingTopTours

exports.aliasingTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

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

//! Get,create,update and delete tours;
exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, { path: "review",strictPopulate:false });

exports.createTour = createOne(Tour);

exports.updateTours = updateOne(Tour);

exports.deleteTours = deleteOne(Tour);
