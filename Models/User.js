const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
      unique: true,
      minlength: [8, "User Name must be at least 8 letters"],
      maxlength: [20, "User Name must be at most 20 letters"],
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 letters"],
    },
    Name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 letters"],
      maxlength: [30, "Name must be at most 30 letters"],
    },
    PhoneNumber: {
      type: String,
      required: false,
    },
    ImgUrl: {
      type: String,
      default: "../Public/avatar.png",
    },
    Role: {
      type: String,
      enum: ["Admin", "User", "Guest"],
      default: "Guest",
    },
    IsDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
