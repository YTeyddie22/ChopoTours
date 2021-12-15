const fs = require('fs');

const express = require('express');

const app = express();

//! Middleware;
app.use(express.json());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();

	console.log('Hello from the middleware');
	next();
});

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const toursRouter = express.Router();
const usersRouter = express.Router();

//! Get all tours method;
const getAllTours = (req, res) => {
	console.log(req.requestTime);
	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		result: tours.length,
		data: {
			tours,
		},
	});
};

//! Get specific tour  method;
const getTour = (req, res) => {
	console.log(req.params);
	const id = +req.params.id;
	const tour = tours.find((el) => el.id === id);

	//? Params not found ?;
	if (!tour) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid id',
		});
	}

	//?Params found ?;
	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
};

//! Post method;

const createTour = (req, res) => {
	//* Creating a new id for the object;

	const newID = tours[tours.length - 1].id + 1;

	//* Creating a new Tour object
	const newTour = Object.assign({ id: newID }, req.body);
	tours.push(newTour);

	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		(err) => {
			res.status(201).json({
				status: 'success',
				data: {
					tour: newTour,
				},
			});
		}
	);
};

//! Update tour method;

const updateTours = (req, res) => {
	if (+req.params.id > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid id',
		});
	}
	res.status(200).json({
		status: 'success',
		data: {
			tours: '<Updated tour....>',
		},
	});
};

//!  Delete Tour method;

const deleteTours = (req, res) => {
	if (+req.params.id > tours.length) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid Id',
		});
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

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

//! Routes;
//* Get and Post
toursRouter.route('/').get(getAllTours).post(createTour);

//* Patch,Update,Delete
toursRouter.route('/:id').patch(updateTours).get(getTour).delete(deleteTours);

//!Users

usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
const port = 3000;

//! Listening to the port;

app.listen(port, function () {
	console.log('app running on port', port);
});
