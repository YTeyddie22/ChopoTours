const Tour = require("./../Models/tourModel");

//! Get all tours method;
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  /*  res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		result: tours.length,
		data: {
			tours,
		},
	});  */
};

//! Get specific tour  method;
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = +req.params.id;

  /* 	
	const tour = tours.find((el) => el.id === id);

	//?Params found ?;
	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	}); */
};

//! Post method;

exports.createTour = async function (req, res) {
  //* awaiting the promise;
  try {
    const newTour = await Tour.create(req.body);
    console.log(newTour);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

//! Update tour method;

exports.updateTours = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour....>",
    },
  });
};

//!  Delete Tour method;

exports.deleteTours = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
