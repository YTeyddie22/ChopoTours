const express = require("express");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  getMyData,
  updateUserData,
  deleteUserData,
  deleteUser,
} = require("./../Controllers/usersController");

//* Router for authentication and login
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require("./../Controllers/authController");

//!Users' Routes

const router = express.Router();

//* SignUp Router
router.post("/signup", signup);

//* Login router
router.post("/login", login);

//* Routes for forgetting password and resetting via email.
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updatePassword);

//* Route for getting user own data
router.get("/me", protect, getMyData, getUser);
//*  updating and deleting user data
router.patch("/updateMe", protect, updateUserData);
router.delete("/deleteMe", protect, deleteUserData);

//* Router for the user;
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
