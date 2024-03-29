const fs = require("fs");
const mongoose = require("mongoose");

const Tour = require("../../Models/tourModel");
const User = require("../../Models/User");
const Review = require("../../Models/Review");

const dotEnv = require("dotenv");

dotEnv.config({
  path: "./config.env",
});

//* Reads the JSON FILE and parses to an object

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/review.json`, "utf-8")
);

//* Database password
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(`Error: ${err}`));

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log("Database loaded");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Database deleted");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteAllData();
}

console.log(process.argv);
