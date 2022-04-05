const User = require("./.././Models/userModel");
const catchAsync = require("./../utils/catchAsync");

//! SignUp function
module.exports.signup = catchAsync(async (req, res, next) => {
  //* Signing up a new user
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});
