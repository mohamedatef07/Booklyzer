const user = require("../Models/User");
const ReadingLog = require("../Models/ReadingLog");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiError = require("../Utils/ApiError");
const mongoose = require("mongoose");
require("dotenv").config();
const tokenKey = process.env.tokenKey;

// Register
async function Register(req, res, next) {
  let { Name, Email, UserName, Password, PhoneNumber } = req.body;
  let findByUserName = await user.findOne({ UserName: UserName });
  let findEmail = await user.findOne({ Email: Email });
  if (!findByUserName && !findEmail) {
    let hashedPassword = await bcrypt.hash(`${Password}`, 5);
    const createdUser = await user.create({
      Name,
      Email,
      UserName,
      Password: hashedPassword,
      PhoneNumber,
    });
    return res.status(200).json({
      Message: "User was registered successfully",
    });
  } else {
    const error = new ApiError("UserName or Email already exists", 409);
    return next(error);
  }
}

// Login
async function Login(req, res, next) {
  let { UserName, Password } = req.body;
  let findByUserName = await user.findOne({ UserName: UserName });
  if (findByUserName) {
    bcrypt.compare(Password, findByUserName.Password, function (error, result) {
      if (error) {
        const error = new ApiError("Invalid Password or User Name", 403);
        return next(error);
      } else if (result == true) {
        let token = jwt.sign({ UserName, Role: findByUserName.Role }, tokenKey);
        return res.status(200).json({
          Message: "Logged in successfully",
          Token: token,
        });
      }
    });
  } else {
    const error = new ApiError("Invalid Password or User Name", 403);
    return next(error);
  }
}

// Get All Users
async function GetAllUsers(req, res, next) {
  let allUsers = await user.aggregate([
    {
      $project: {
        _id: 0,
        Name: 1,
        Email: 1,
        UserName: 1,
        PhoneNumber: 1,
        Role: 1,
      },
    },
  ]);
  if (allUsers.length > 0) {
    return res.status(200).json({
      Message: "Get all users successfully",
      Data: allUsers,
    });
  } else {
    const error = new ApiError("No users found", 404);
    return next(error);
  }
}

// Get User By ID
async function GetUserById(req, res, next) {
  let { userId } = req.params;
  const foundUser = await user.findById(userId);
  if (foundUser && foundUser.IsDeleted == false) {
    return res.status(200).json({
      Message: "User retrieved successfully",
      Data: foundUser,
    });
  } else {
    const error = new ApiError("User not found", 404);
    return next(error);
  }
}

// Edit User
async function EditUser(req, res, next) {
  let { userId } = req.params;
  const existUser = await user.findById(userId);
  if (!existUser) {
    const error = new ApiError("User not found", 404);
    return next(error);
  }
  let updatedUser = await user.updateOne({ _id: userId }, { $set: req.body });
  if (updatedUser.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Updated user successfully",
    });
  } else {
    const error = new ApiError("No changes were made to the user", 404);
    return next(error);
  }
}

// Delete User
async function DeleteUser(req, res, next) {
  let { userId } = req.params;
  const existUser = await user.findById(userId);
  if (!existUser || existUser.IsDeleted) {
    const error = new ApiError("User not found or already deleted", 404);
    return next(error);
  }
  let deletedUser = await user.updateOne(
    { _id: userId },
    { $set: { IsDeleted: true } }
  );
  if (deletedUser.modifiedCount === 1) {
    return res.status(200).json({
      Message: "User marked as deleted successfully",
    });
  } else {
    const error = new ApiError("No changes were made to the user", 404);
    return next(error);
  }
}
// Assign Role to User
async function AssignRole(req, res, next) {
  const { userId } = req.params;
  const { Role } = req.body;
  const existUser = await user.findById(userId);
  if (!existUser || existUser.IsDeleted) {
    const error = new ApiError("User not found or already deleted", 404);
    return next(error);
  }
  if (!Role) {
    const error = new ApiError("Role is required", 400);
    return next(error);
  }
  const updated = await user.updateOne({ _id: userId }, { $set: { Role } });
  if (updated.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Assign role successfully",
    });
  } else {
    const error = new ApiError("Failed to assign role", 400);
    return next(error);
  }
}

// Search Users
async function SearchUsers(req, res, next) {
  const { keyword } = req.query;
  if (!keyword || keyword.trim() === "") {
    const error = new ApiError("Search keyword is required", 400);
    return next(error);
  }
  const users = await user.find({
    IsDeleted: { $ne: true },
    $or: [
      { Name: { $regex: keyword, $options: "i" } },
      { Email: { $regex: keyword, $options: "i" } },
      { UserName: { $regex: keyword, $options: "i" } },
    ],
  });
  return res.status(200).json({
    Message: "Search completed",
    Data: users,
  });
}

// Change User Photo
async function ChangePhoto(req, res, next) {
  let { userId } = req.params;
  if (!userId) {
    const error = new ApiError("User Id is required", 400);
    return next(error);
  }
  const currentUser = await user.findById(userId);
  if (!currentUser) {
    const error = new ApiError("User not found", 404);
    return next(error);
  } else {
    if (!req.file) {
      const error = new ApiError("ImgUrl is required", 400);
      return next(error);
    }
    const filePath = req.file.path;
    await user.updateOne({ _id: userId }, { $set: { ImgUrl: filePath } });
    return res.status(200).json({
      Message: "User photo updated successfully",
    });
  }
}

// Change User Password
async function ChangePassword(req, res, next) {
  let { userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  const currentUser = await user.findById(userId);
  if (!currentUser) {
    const error = new ApiError("User not found", 404);
    return next(error);
  }
  if (!oldPassword || !newPassword) {
    const error = new ApiError("Old and new passwords are required", 400);
    return next(error);
  }
  if (oldPassword === newPassword) {
    const error = new ApiError("New password must be different from the old one", 400);
    return next(error);
  }
  const isMatch = await bcrypt.compare(oldPassword, currentUser.Password);
  if (!isMatch) {
    const error = new ApiError("Old password is incorrect", 403);
    return next(error);
  } else {
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    await user.updateOne(
      { _id: userId },
      { $set: { Password: hashedPassword } }
    );
    return res.status(200).json({
      Message: "Password changed successfully",
    });
  }
}

// Log a reading session
async function logReading(req, res, next) {
  const { book, pagesRead, duration } = req.body;
  if (!book) {
    const error = new ApiError("Book ID is required", 400);
    return next(error);
  }
  if (pagesRead && (typeof pagesRead !== "number" || pagesRead < 0)) {
    const error = new ApiError("Pages read must be a positive number", 400);
    return next(error);
  }
  if (duration && (typeof duration !== "number" || duration < 0)) {
    const error = new ApiError("Duration must be a positive number", 400);
    return next(error);
  }
  try {
    const readingLog = await ReadingLog.create({
      user: req.user.id,
      book,
      pagesRead: pagesRead || 0,
      duration: duration || 0,
    });
    return res.status(201).json({
      Message: "Reading session logged successfully",
      Data: readingLog,
    });
  } catch (err) {
    console.error("Error logging reading session:", err);
    const error = new ApiError("Failed to log reading session", 400);
    return next(error);
  }
}

// Calculate daily reading statistics
async function getDailyReadingStats(req, res, next) {
  try {
    const userId = req.user.Role === "admin" && req.query.userId ? req.query.userId : req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dailyStats = await ReadingLog.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalPages: { $sum: "$pagesRead" },
          totalDuration: { $sum: "$duration" },
          booksRead: { $addToSet: "$book" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSessions: 1,
          totalPages: 1,
          totalDuration: 1,
          totalBooks: { $size: "$booksRead" },
        },
      },
    ]);

    const stats = dailyStats[0] || {
      totalSessions: 0,
      totalPages: 0,
      totalDuration: 0,
      totalBooks: 0,
    };
    return res.status(200).json({
      Message: "Daily reading stats retrieved successfully",
      Data: stats,
    });
  } catch (err) {
    console.error("Error calculating daily reading stats:", err);
    const error = new ApiError("Failed to calculate daily reading stats", 500);
    return next(error);
  }
}

// Calculate annual reading statistics
async function getAnnualReadingStats(req, res, next) {
  try {
    const userId = req.user.Role === "admin" && req.query.userId ? req.query.userId : req.user.id;
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfNextYear = new Date(currentYear + 1, 0, 1);

    const annualStats = await ReadingLog.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: startOfYear, $lt: startOfNextYear },
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalPages: { $sum: "$pagesRead" },
          totalDuration: { $sum: "$duration" },
          booksRead: { $addToSet: "$book" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSessions: 1,
          totalPages: 1,
          totalDuration: 1,
          totalBooks: { $size: "$booksRead" },
        },
      },
    ]);

    const stats = annualStats[0] || {
      totalSessions: 0,
      totalPages: 0,
      totalDuration: 0,
      totalBooks: 0,
    };
    return res.status(200).json({
      Message: "Annual reading stats retrieved successfully",
      Data: stats,
    });
  } catch (err) {
    console.error("Error calculating annual reading stats:", err);
    const error = new ApiError("Failed to calculate annual reading stats", 500);
    return next(error);
  }
}

module.exports = {
  Register,
  Login,
  GetAllUsers,
  GetUserById,
  EditUser,
  DeleteUser,
  AssignRole,
  SearchUsers,
  ChangePhoto,
  ChangePassword,
  logReading,
  getDailyReadingStats,
  getAnnualReadingStats,
};


