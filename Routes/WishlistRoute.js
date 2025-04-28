const express = require("express");
const route = express.Router();
const wishlistController = require("../Controllers/WishlistController");
const asyncWrapper = require("../utils/HandelErr");
const isAuthorize = require("../Middlewares/Authorization");

// Add To Wishlist
route.post(
  "/add",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(wishlistController.AddToWishlist)
);
// Remove From Wishlist
route.delete(
  "/delete/:bookId/:userId",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(wishlistController.RemoveFromWishlist)
);
// Clear wishlist
route.delete(
  "/clear/:userId",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(wishlistController.ClearWishlist)
);
// Get Wishlist By User
route.get(
  "/get/:userId",
  isAuthorize(["Admin", "User"]),
  asyncWrapper(wishlistController.GetWishlistByUser)
);

module.exports = route;
