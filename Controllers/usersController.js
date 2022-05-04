const User = require("./../Models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//! Get all tours method;
exports.getAllTours = catchAsync(async (req, res, next) => {
  // * Object containing all the functions from the ApiFeature Class

  const users = await User.find();

  res.status(200).json({
    status: "success",

    result: users.length,
    data: {
      users,
    },
  });
});

//! Get specific tour  method;
exports.getTour = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError(`No tour found with id`, 404));

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

  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

//! Update tour method;

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,

    runValidators: true,
  });

  if (!user) return next(new AppError(`Cannot update user`, 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

//!  Delete Tour method;

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError(`No tour found with id`, 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
