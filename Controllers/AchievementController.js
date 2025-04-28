const Achievement = require("../Models/Achievement");
const ApiError = require("../Utils/ApiError");

async function getAchievements(req, res, next) {
  try {
    const achievements = await Achievement.find({
      user: req.user.id,
      isDeleted: false,
    }).sort("-createdAt");

    res.status(200).json({ success: true, data: achievements });
  } catch (err) {
    console.error("Error fetching achievements:", err);
    const error = new ApiError("Failed to fetch achievements", 500);
    return next(error);
  }
}

async function createAchievement(req, res, next) {
  try {
    const achievementData = {
      achievementName: req.body.achievementName,
      description: req.body.description,
      iconUrl: req.body.iconUrl,
      points: req.body.points,
      level: req.body.level,
      book: req.body.book,
      user: req.user.id,
    };

    const achievement = await Achievement.create(achievementData);
    res.status(201).json({ success: true, data: achievement });
  } catch (err) {
    console.error("Error creating achievement:", err);
    const error = new ApiError(err.message || "Invalid achievement data", 400);
    return next(error);
  }
}

async function updateAchievement(req, res, next) {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      const error = new ApiError("Achievement not found", 404);
      return next(error);
    }

    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    console.error("Error updating achievement:", err);
    if (err.name === "ValidationError") {
      const error = new ApiError(err.message, 400);
      return next(error);
    }
    const error = new ApiError("Failed to update achievement", 500);
    return next(error);
  }
}

async function deleteAchievement(req, res, next) {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!achievement) {
      const error = new ApiError("Achievement not found", 404);
      return next(error);
    }

    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    console.error("Error deleting achievement:", err);
    const error = new ApiError("Failed to delete achievement", 500);
    return next(error);
  }
}

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};