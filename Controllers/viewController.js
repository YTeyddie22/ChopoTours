/**
 *Imports
 */
const Tours = require("../Models/tourModel");
const catchAsync = require("../utils/catchAsync");

//! Get overview data
exports.getOverview = catchAsync(async (req, res, next) => {
  /**
   * 1. Get data from tour collection
   * 2. Build the template ( To be done in overview page)
   * 3. Render the template using data retrieved.
   */

  //? 1.Get data from Collection

  const tours = await Tours.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "The Nakuru life",
  });
};
