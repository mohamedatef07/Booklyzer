const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookSchema = mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      unique: true,
    },
    Author: {
      type: String,
      required: true,
    },
    Publisher: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      enum: [
        "Fiction",
        "Non-fiction",
        "Biography",
        "Self-help",
        "Science",
        "Technology",
        "History",
        "Philosophy",
        "Poetry",
        "Fantasy",
        "Mystery",
        "Horror",
        "Comics",
        "Children",
        "Education",
        "Religion",
        "Art",
        "Business",
        "Travel",
      ],
      required: true,
    },
    TotalPages: {
      type: Number,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Rate: {
      type: Number,
      required: true,
    },
    ImageURL: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["To Read", "Reading", "I've read it all"],
      default: "To Read",
    },
    IsDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
