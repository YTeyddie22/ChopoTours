const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./../utils/appError");
const Tour = require("./../Models/tourModel");

const catchAsync = require("./../utils/catchAsync");

const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require("./factoryHandler");

/**
 * ? Giving Images a better file Name
 * ? Allowing only Image files to be uploaded to the server
 *Saving it to Disk storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  },
});
*/

/**
 * ? Giving Images a better file Name
 * ? Allowing only Image files to be uploaded to the server
 *Saving it to Memory as a buffer
 */

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Not an image! Please upload only image.", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
    {
        name: "imageCover",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 3,
    },
]);

/**
 * Resizing tour images;
 */

exports.resizeTourImages = catchAsync(async (req, res, next) => {
   

    if (!req.files.imageCover || !req.files.images) next();

    //Cover Image;

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    //For the images

    req.body.images = [];
    await Promise.all(
        req.files.images.map(async function (file, i) {
            const filename = `tour-${req.params.id}-${Date.now()}-${
                i + 1
            }.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});
//! Get aliasingTopTours

exports.aliasingTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";

    next();
};

//! Get Tour Stats
exports.getTourStats = catchAsync(async (req, res, next) => {
    //* Aggregation pipelining with Mongoose/MongoDb
    const tourStats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },

        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                tourNum: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        {
            $sort: {
                avgPrice: 1,
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        data: tourStats,
    });
});

//!  Business logic to get highest number of tours in the Months
exports.getMonthlyPlan = catchAsync(async function (req, res, next) {
    //* Convert year to numbers

    const year = +req.params.year;

    //*Aggregation process

    const plan = await Tour.aggregate([
        //For destructuring and getting the dates
        {
            $unwind: "$startDates",
        },

        //For matching and relating to whether it is gte or lte to the dates
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },

        //Grouping id, number of tours and name of the tours
        {
            $group: {
                _id: { $month: "$startDates" },
                numTourStart: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        // Adding the field of months that will replace the _id field
        {
            $addFields: { month: "$_id" },
        },

        // Delete the _id field
        {
            $project: {
                _id: 0,
            },
        },

        // Sort the data according to the number of tours in descending format
        { $sort: { numTourStart: -1 } },
    ]);
    res.status(200).json({
        status: "success",
        data: plan,
    });
});

/**
 * ! Get tour Geospatial data controller;
 */

exports.getToursWithin = catchAsync(async (req, res, next) => {
    //* getting all data;
    const { distance, latlng, unit } = req.params;

    //* Get coords;

    const [lat, lng] = latlng.split(",");

    //* Get the radians for the earth in miles and kilometres;

    const radius = unit === "mi" ? distance / 3962.2 : distance / 6378.1;

    //* Return a bad request message;
    if (!lat || !lng) {
        return next(
            new AppError(
                "Specify the latitude and longitude in the format lat,lng"
            ),
            400
        );
    }

    /**The main Area for Geospatial functionality
     * *We use the startLocation to find the area we are in;
     * *GeoWithin is from MongoDb that checks the areas that are within a specific radius;
     * *CenterSphere locates our center(Where we are at);
     *
     */
    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    });

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            data: tours,
        },
    });
});

/**
 *? Using the Geospatial Aggregation for getting distances
 * * Always start with GeoNear;
 */

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;

    //* Get coords;

    const [lat, lng] = latlng.split(",");

    const multiplier = unit === "km" ? 0.001 : 0.000621371;

    if (!lat || !lng) {
        return next(
            new AppError(
                "Specify the latitude and longitude in the format lat,lng"
            ),
            400
        );
    }

    /**
     *? Getting the distances and determining how to convert the distance
     * The Geonear amd distanceField are mandatory;
     */

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [+lng, +lat],
                },
                distanceField: "distance",
                distanceMultiplier: multiplier,
                spherical: true,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    //console.log(distances);

    res.status(200).json({
        status: "success",
        data: {
            data: distances,
        },
    });
});

//! Get,create,update and delete tours;
exports.getAllTours = getAll(Tour);

exports.getTour = getOne(Tour, { path: "review", strictPopulate: false });

exports.createTour = createOne(Tour);

exports.updateTours = updateOne(Tour);

exports.deleteTours = deleteOne(Tour);
