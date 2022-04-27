const jwt = require("jsonwebtoken");
const User = require("./.././Models/userModel");
const catchAsync = require("./../utils/catchAsync");

//! SignUp function
module.exports.signup = catchAsync(async (req, res, next) => {
  //* Signing up a new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
