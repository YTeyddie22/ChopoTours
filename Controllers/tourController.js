const Tour = require("./../Models/tourModel");

//! Get all tours method;
exports.getAllTours = async (req, res) => {
  try {

    //* Creating a query object

    const queryObj = {...req.query}
    const excludeItems = ["sort","limit","field","page"]
    excludeItems.forEach(el=>delete queryObj[el])

    let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt])\b/g,match=>`$${match}`)


    const query = Tour.find(JSON.parse(queryString))


    const tours = await query

    console.log(tours)


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
