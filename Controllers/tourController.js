const Tour = require("./../Models/tourModel");

const ApiFeatures = require('./../utils/apiFeatures.js')


//! Get aliasingTopTours

exports.aliasingTopTours=(req,res,next)=>{
req.query.limit = '5';
req.query.sort = '-ratingsAverage,price';
req.query.fields = 'name,price,ratingsAverage,summary,difficulty'

next();

}


//! Get all tours method;
exports.getAllTours = async (req, res) => {
  try {

    // * Object containing all the functions from the ApiFeature Class
      const features = new ApiFeatures(Tour.find(),req.query)
      .filter()
      .sort()
      .limitField()
      .pagination()

      const tours = await features.query

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
