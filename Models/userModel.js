const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Your name"],
    maxLength: [15, "A tour must have less than or 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter Email"],
    unique: true,
    validate: [validator.isEmail, "Enter correct e-mail"],
  },
  photo: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Enter Email"],
    unique: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Enter to confirm Email"],
    unique: true,
    minLength: 8,
  },
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;
