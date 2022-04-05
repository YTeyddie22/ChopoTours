const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("./../Controllers/usersController");

const { signup } = require("./../Controllers/authController");

//!Users

const router = express.Router();

//* SignUp Router
router.post("/signup", signup);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
