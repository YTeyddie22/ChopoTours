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

//! get specific user  method;
exports.getUser = (req, res) => {};

//!Post new User;
exports.createUser = (req, res) => {};

//!Update user method;
exports.updateUser = (req, res) => {};

//!delete user method;
exports.deleteUser = (req, res) => {};
