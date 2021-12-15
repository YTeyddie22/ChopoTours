const express = require('express');

const morgan = require('morgan');

const app = express();

const toursRouter = require('./route/tourRoutes');
const userRouter = require('./route/userRoutes');

//! Middleware;
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();

	console.log('Hello from the middleware');
	next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

//! Listening to the port;

module.exports = app;
