const book = require("../Models/Book");
const ApiError = require("../Utils/ApiError");
const fs = require("fs");

// Add Book
async function AddBook(req, res, next) {
  let {
    Title,
    Author,
    Publisher,
    Category,
    TotalPages,
    Description,
    Rate,
    Status,
    UserId,
  } = req.body;
  const ImageURL = req.file ? req.file.path : null;
  if (!ImageURL) {
    const error = new ApiError("Book image is required", 400);
    return next(error);
  }
  let bookAdded = await book.create({
    Title,
    Author,
    Publisher,
    Category,
    TotalPages,
    Description,
    Rate,
    ImageURL,
    Status,
    UserId,
  });
  if (bookAdded) {
    return res.status(200).json({
      Message: "Book added successfully",
    });
  } else {
    const error = new ApiError("Failed to add book", 500);
    return next(error);
  }
}

// Edit Book
async function EditBook(req, res, next) {
  let { bookId } = req.params;
  const existBook = await book.findById(bookId);
  if (!existBook) {
    const error = new ApiError("Book not found", 404);
    return next(error);
  }
  let updatedBook = await book.updateOne({ _id: bookId }, { $set: req.body });
  if (updatedBook.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Updated book successfully",
    });
  } else {
    const error = new ApiError("No changes were made to the book", 404);
    return next(error);
  }
}

// Delete Book (soft delete)
async function DeleteBook(req, res, next) {
  let { bookId } = req.params;
  const existBook = await book.findById(bookId);
  if (!existBook || existBook.IsDeleted) {
    const error = new ApiError("Book not found or already deleted", 404);
    return next(error);
  }
  let deletedBook = await book.updateOne(
    { _id: bookId },
    { $set: { IsDeleted: true } }
  );
  if (deletedBook.modifiedCount === 1) {
    return res.status(200).json({
      Message: "Book marked as deleted successfully",
    });
  } else {
    const error = new ApiError("No changes were made to the book", 404);
    return next(error);
  }
}

// Get All Books
async function GetAllBooks(req, res, next) {
  let books = await book.find({ IsDeleted: { $ne: true } });
  if (books.length > 0) {
    return res.status(200).json({
      Message: "Books fetched successfully",
      Data: books,
    });
  } else {
    const error = new ApiError("No books found", 404);
    return next(error);
  }
}

// Get Book By Id
async function GetBookById(req, res, next) {
  let { bookId } = req.params;
  const foundBook = await book.findOne({
    _id: bookId,
    IsDeleted: { $ne: true },
  });
  if (foundBook) {
    return res.status(200).json({
      Message: "Book fetched successfully",
      Data: foundBook,
    });
  } else {
    const error = new ApiError("Book not found", 404);
    return next(error);
  }
}

// Search Books
async function SearchBooks(req, res, next) {
  const { keyword } = req.query;
  if (!keyword || keyword.trim() === "") {
    const error = new ApiError("Search keyword is required", 400);
    return next(error);
  }
  const books = await book.find({
    IsDeleted: { $ne: true },
    $or: [
      { Title: { $regex: keyword, $options: "i" } },
      { Author: { $regex: keyword, $options: "i" } },
    ],
  });
  return res.status(200).json({
    Message: "Search completed",
    Data: books,
  });
}

// Filter Books By Category
async function FilterBooksByCategory(req, res, next) {
  const { category } = req.params;
  if (!category) {
    const error = new ApiError("Category is required", 400);
    return next(error);
  }
  const booksInCategory = await book.find({
    Category: category,
    IsDeleted: { $ne: true },
  });
  return res.status(200).json({
    Message: `Books in Category: ${category}`,
    Data: booksInCategory,
  });
}

module.exports = {
  AddBook,
  EditBook,
  DeleteBook,
  GetAllBooks,
  GetBookById,
  SearchBooks,
  FilterBooksByCategory,
};
