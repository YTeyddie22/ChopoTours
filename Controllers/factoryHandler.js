const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

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

//! Factory setting for getting data.

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const document = await query;

    res.status(200).json({
      status: "success",
      data: {
        data: document,
      },
    });
  });
