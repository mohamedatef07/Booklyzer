const mongoose = require("mongoose");

const ReadingLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    pagesRead: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


ReadingLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("ReadingLog", ReadingLogSchema);