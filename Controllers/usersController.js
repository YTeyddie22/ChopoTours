const multer = require("multer");
const sharp = require("sharp");
const User = require("../Models/User");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { deleteOne, updateOne, getOne, getAll } = require("./factoryHandler");

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

exports.uploadUserPhoto = upload.single("photo");

/**
 * Resizing User Photo
 */

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    /**
     * The file that was saved as a buffer
     *
     * ?Sharp resizes the Image.
     */

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

//! Normal JS Function for filtering the objects;
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    //* Filter the data using the object keys that have been put in an array
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};

//!User ability to retrieve own data;

exports.getMyData = (req, res, next) => {
    req.params.id = req.user.id;

    next();
};

//! Update the  User data in the body;

exports.updateUserData = catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    //* 1. Create an error incase the user tries to update the password;

    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError(
                "You are trying to update password from the wrong place Friend",
                400
            )
        );
    }

    //* FIlter the objects to prevent malicious changes;
    const filteredObjects = filterObj(req.body, "name", "email");

    if (req.file) filteredObjects.photo = req.file.filename;

    //* 2. Update the user document;

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredObjects,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

//! Delete the user but not from the database;

exports.deleteUserData = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false,
    });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

//! Get specific user
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined! Go and sign up!",
    });
};

//! Get all Users methods;
exports.getAllUsers = getAll(User);

exports.getUser = getOne(User);

exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);
