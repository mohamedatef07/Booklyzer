const express = require("express");
const route = express.Router();
const userController = require("../Controllers/UserController");
const asyncWrapper = require("../utils/HandelErr");
const isAuthorize = require("../Middlewares/Authorization");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "Uploads/");
  },
  filename: function (req, file, callback) {
    const fileName = uuidv4() + "-" + file.originalname;
    callback(null, fileName);
  },
});
const upload = multer({ storage });

// Register
route.post(
  "/register",
  upload.single("ImgUrl"),
  asyncWrapper(userController.Register)
);
// Login
route.post("/login", asyncWrapper(userController.Login));
// Get All Users
route.get(
  "/get-all",
  isAuthorize(["admin"]),
  asyncWrapper(userController.GetAllUsers)
);
// Get User By ID
route.get(
  "/get-user/:userId",
  isAuthorize(["admin"]),
  asyncWrapper(userController.GetUserById)
);
// Edit User
route.put(
  "/edit/:userId",
  isAuthorize(["admin"]),
  asyncWrapper(userController.EditUser)
);
// Delete User (soft delete)
route.delete(
  "/delete/:userId",
  isAuthorize(["admin"]),
  asyncWrapper(userController.DeleteUser)
);
// Assign Role to User
route.post(
  "/add-role/:userId",
  isAuthorize(["admin"]),
  asyncWrapper(userController.AssignRole)
);
// Search Users
route.get(
  "/search",
  isAuthorize(["admin"]),
  asyncWrapper(userController.SearchUsers)
);
// Change User Photo
route.put(
  "/change-photo/:userId",
  isAuthorize(["admin", "user"]),
  upload.single("ImgUrl"),
  asyncWrapper(userController.ChangePhoto)
);
// Change User Password
route.put(
  "/change-password/:userId",
  isAuthorize(["admin", "user"]),
  asyncWrapper(userController.ChangePassword)
);
// Log a Reading Session
route.post(
  "/log-reading",
  isAuthorize(["user", "admin"]),
  asyncWrapper(userController.logReading)
);
// Get Daily Reading Statistics
route.get(
  "/daily-reading-stats",
  isAuthorize(["user", "admin"]),
  asyncWrapper(userController.getDailyReadingStats)
);
// Get Annual Reading Statistics
route.get(
  "/annual-reading-stats",
  isAuthorize(["user", "admin"]),
  asyncWrapper(userController.getAnnualReadingStats)
);

module.exports = route;