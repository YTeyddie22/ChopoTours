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
  restrictTo,
  updatePassword,
  logout,
} = require("./../Controllers/authController");

//!Users' Routes

const router = express.Router();

//* SignUp Router
router.post("/signup", signup);

//* Login router
router.post("/login", login);

//*Logout router;

router.get("/logout", logout);

//* Routes for forgetting password and resetting via email.
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

router.use(protect);

router.patch("/updateMyPassword", updatePassword);
//* Route for getting user own data
router.get("/me", getMyData, getUser);
//*  updating and deleting user data
router.patch("/updateMe", updateUserData);
router.delete("/deleteMe", deleteUserData);

router.use(restrictTo("admin"));

//* Router for the user;
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
