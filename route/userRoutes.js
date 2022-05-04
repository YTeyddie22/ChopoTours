const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("./../Controllers/usersController");

const { signup, login } = require("./../Controllers/authController");

//!Users

const router = express.Router();

//* SignUp Router
router.post("/signup", signup);

//* Login router
router.post("/login", login);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
