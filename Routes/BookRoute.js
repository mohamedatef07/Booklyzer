const express = require("express");
const route = express.Router();
const bookController = require("../Controllers/BookController");
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

// Add Book
route.post(
  "/add",
  upload.single("ImageURL"),
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.AddBook)
);
// Edit Book
route.put(
  "/edit/:bookId",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.EditBook)
);
// Delete Book (soft delete)
route.delete(
  "/delete/:bookId",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.DeleteBook)
);
// Get All Books
route.get(
  "/get-all",
  isAuthorize(["Admin"]),
  asyncWrapper(bookController.GetAllBooks)
);
// Get Book By Id
route.get(
  "/get-book/:bookId",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(bookController.GetBookById)
);
// Search Books
route.get(
  "/search",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(bookController.SearchBooks)
);
// Filter Books By Category
route.get(
  "/filter/:category",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(bookController.FilterBooksByCategory)
);

module.exports = route;
