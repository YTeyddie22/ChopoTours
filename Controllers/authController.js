const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const catchAsync = require("./../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
//! SignUp function
exports.signup = catchAsync(async (req, res, next) => {
  //* Signing up a new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

//! for Logging in

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(`Enter both password and email`, 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || (await user.correctPassword(password, user.password)))
    return next(new AppError(`Enter correct email or password`, 401));

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
