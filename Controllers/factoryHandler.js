const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ApiFeatures = require("./../utils/apiFeatures.js");

//! Factory setting for deleting document
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) return next(new AppError(`No document found with id`, 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

//!Factory settings for updating document
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,

      runValidators: true,
    });

    if (!document) return next(new AppError(`Cannot update document`, 404));

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

//! Factory settings for creating document

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //* awaiting the promise;

    const document = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

//! Factory setting for getting documents.

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    console.log(query);
    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;
    if (!document) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });

//! Factory setting for getting all Data;

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //* For nested Get review on tours.

    let filter = {};

    if (req.params.tourId)
      filter = {
        tour: req.params.tourId,
      };

    //* For all the API features.
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitField()
      .pagination();

    const document = await features.query;

    res.status(200).json({
      status: "success",

      result: document.length,
      data: {
        document,
      },
    });
  });
