const Tour = require("./../Models/tourModel");

const ApiFeatures = require("./../utils/apiFeatures.js");

//! Get aliasingTopTours

exports.aliasingTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

//! Get all tours method;
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

//! Get specific tour  method;
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

//! Post method;

exports.createTour = async function (req, res) {
  //* awaiting the promise;

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

//! Update tour method;

exports.updateTours = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,

      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

//!  Delete Tour method;

exports.deleteTours = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

//!  Business logic to get highest number of tours in the Months
exports.getMonthlyPlan = async function (req, res) {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err,
    });
  }
};
