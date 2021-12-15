const fs = require('fs');

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, id) => {
	console.log(`The tour id is ${id}`);
	if (!id) {
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid id',
		});
	}
	next();
};

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: 'fail',
			message: 'Missing name or price',
		});
	}
	next();
};
//! Get all tours method;
exports.getAllTours = (req, res) => {
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
exports.getTour = (req, res) => {
	console.log(req.params);
	const id = +req.params.id;
	const tour = tours.find((el) => el.id === id);

	//?Params found ?;
	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
};

//! Post method;

exports.createTour = (req, res) => {
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

exports.updateTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			tours: '<Updated tour....>',
		},
	});
};

//!  Delete Tour method;

exports.deleteTours = (req, res) => {
	res.status(204).json({
		status: 'success',
		data: null,
	});
};
