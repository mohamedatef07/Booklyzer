const Memorization = require("../Models/Memorization");
const ApiError = require("../Utils/ApiError");

async function createMemorization(req, res, next) {
  try {
    const memorization = await Memorization.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json({ success: true, data: memorization });
  } catch (err) {
    const error = new ApiError("Invalid memorization data", 400);
    return next(error);
  }
}

async function getMemorizations(req, res, next) {
  try {
    const memorizations = await Memorization.find({
      user: req.user.id,
      isDeleted: false,
    }).populate("book", "title author");

    res.status(200).json({ success: true, data: memorizations });
  } catch (err) {
    const error = new ApiError("Server error", 500);
    return next(error);
  }
}

async function updateMemorization(req, res, next) {
  try {
    const memorization = await Memorization.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!memorization) {
      const error = new ApiError("Memorization not found", 404);
      return next(error);
    }

    res.status(200).json({ success: true, data: memorization });
  } catch (err) {
    const error = new ApiError("Update failed", 400);
    return next(error);
  }
}

async function deleteMemorization(req, res, next) {
  try {
    const memorization = await Memorization.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!memorization) {
      const error = new ApiError("Memorization not found", 404);
      return next(error);
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    const error = new ApiError("Server error", 500);
    return next(error);
  }
}

module.exports = {
  createMemorization,
  getMemorizations,
  updateMemorization,
  deleteMemorization,
};