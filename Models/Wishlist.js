const mongoose = require("mongoose");
const { Schema } = mongoose;
const wishlistSchema = mongoose.Schema(
  {
    Priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    DateAdded: {
      type: Date,
      default: Date.now,
      required: true,
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
    BookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
