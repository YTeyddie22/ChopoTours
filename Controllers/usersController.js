const User = require("../Models/User");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//! get all Users method;
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  console.log(users);

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

//! Get specific tour  method;
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//! Get specific user
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//! Upadate User
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//! DElete USer
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
