const User = require("../Models/User");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//! Normal JS Function for filtering the objects;
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  //* Filter the data using the object keys that have been put in an array
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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

//! Update the  User data in the body;

exports.updateUserData = catchAsync(async (req, res, next) => {
  //* 1. Create an error incase the user tries to update the password;

  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "You are trying to update data of password from the wrong place Friend",
        400
      )
    );
  }

  //* FIlter the objects to prevent malicious changes;
  const filteredObjects = filterObj(req.body, "name", "email");

  //* 2. Update the user document;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredObjects,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//! Delete the user but not from the database;

exports.deleteUserData = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
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

//! Update User
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
