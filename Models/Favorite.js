const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favorite", FavoriteSchema);