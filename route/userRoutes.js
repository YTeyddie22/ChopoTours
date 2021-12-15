const express = require('express');

//! get all Users method;

const getAllUsers = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined',
	});
};

//! get specific user  method;
const getUser = (req, res) => {};

//!Post new User;
const createUser = (req, res) => {};

//!Update user method;
const updateUser = (req, res) => {};

//!delete user method;
const deleteUser = (req, res) => {};

//!Users

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
