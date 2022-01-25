const Tour = require("./../Models/tourModel");

//! Get all tours method;
exports.getAllTours = async (req, res) => {
  try {


    //* Creating a query object


//~ Filtering

  const queryObj = {...req.query}

  const excludedItems = ['page','limit','sort','field']

  excludedItems.forEach(i=>delete queryObj[i])


  let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)

      let query = Tour.find(JSON.parse(queryStr))


      //~ Sorting

      if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(" ")

        query = query.sort(sortBy)
        console.log(query);
      }

      const tours = await query




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
