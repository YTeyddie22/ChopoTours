const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Your name"],

    minLength: [20, "A tour must have more than or 10 characters"],
    maxLength: [40, "A tour must have less than or 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter Email"],
    unique: true,
    validate: [validator.isEmail, "Enter correct e-mail"],
  },
  photo: {
    type: String,
    required: [true, "Enter Email"],
    unique: true,
    minLength: [10, "A tour must have more than or 10 characters"],
    maxLength: [40, "A tour must have less than or 40 characters"],
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
