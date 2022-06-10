const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Fill in your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  //TODO: There are somethings to be done as the role !working when deleting in postman.
  role: {
    type: String,
    required: [true, "everyone has a role to play"],
    enum: {
      values: ["user", "admin", "guide", "lead-guide"],
      message: "Can be user, admin, lead-guide, or guide",
    },
  },
  photo: String,

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //* This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },

  passwordChangedAt: {
    type: Date,
    default: Date,
  },

  passwordResetToken: String,

  passwordResetExpires: {
    type: Date,
    default: Date,
  },
});

//* Introducing Pre-save to get the hashed password before it is saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //* For the hash Password
  this.password = await bcrypt.hash(this.password, 12);

  //* Remove the confirm Field
  this.confirmPassword = undefined;

  next();
});

//*1 Introducing an instantiated method.
userSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

//*2 Checking the time password was changed.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

//* Creating a token.

userSchema.methods.createPasswordResetToken = function () {
  // Changes to random strings that are put in hexadecimals.
  const resetToken = crypto.randomBytes(32).toString("hex");

  //Hash the password and update it to a digestible hexadecimal

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  //The time to expire in 10 minutes.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
