const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../Models/User");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//* JWT sign function.

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//! SignUp function
exports.signup = catchAsync(async function (req, res, next) {
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

  //* Check the !correct password for the user.
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError(`Enter correct email or password`, 401));

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //*1 Get token and check if it is present
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in. Confirm Passwords are the same`, 401)
    );
  }

  //* 2 Verifying the token.

  //TODO
  const decoder = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //*3 Check if the user still exists in the app or changed password.

  const decodedCurrentUserId = await User.findById(decoder.id);

  if (!decodedCurrentUserId) {
    return next(new AppError("The user by this ID no longer exists", 401));
  }

  //*4 Check whether password changed after issuing of token

  if (decodedCurrentUserId.changedPasswordAfter(decoder.iat)) {
    return next(new AppError("The user changed his/her ID recently!", 401));
  }

  //* Allow access to app;

  req.user = decodedCurrentUserId;

  next();
});
