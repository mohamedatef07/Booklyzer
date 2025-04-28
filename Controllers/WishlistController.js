const wishlist = require("../Models/Wishlist");
const ApiError = require("../Utils/ApiError");

// Add To Wishlist
async function AddToWishlist(req, res, next) {
  let { bookId, userId, priority } = req.body;
  const isExist = await wishlist.findOne({
    BookId: bookId,
    UserId: userId,
    IsDeleted: false,
  });
  if (!isExist) {
    await wishlist.create({
      BookId: bookId,
      UserId: userId,
      Priority: priority,
    });
    return res.status(200).json({
      Message: "Book added to wishlist successfully",
    });
  } else {
    const error = new ApiError("Book already in wishlist", 409);
    return next(error);
  }
}

// Remove From Wishlist || Hard Delete Not Soft
async function RemoveFromWishlist(req, res) {
  let { bookId, userId } = req.params;
  const isExist = await wishlist.findOne({
    BookId: bookId,
    UserId: userId,
    IsDeleted: false,
  });
  if (isExist) {
    await wishlist.deleteOne({ BookId: bookId, UserId: userId });
    return res.status(200).json({
      Message: "Book removed from wishlist successfully",
    });
  } else {
    const error = new ApiError("Book is not found in wishlist", 404);
    return next(error);
  }
}

// Clear wishlist
async function ClearWishlist(req, res, next) {
  let { userId } = req.params;
  if (!userId) {
    const error = new ApiError("User Id is required", 400);
    return next(error);
  } else {
    const userWishlist = await wishlist.find({ UserId: userId });
    if (userWishlist && userWishlist.length > 0) {
      await wishlist.deleteMany({ UserId: userId });
      return res.status(200).json({
        Message: "Wishlist cleared successfully",
      });
    } else {
      const error = new ApiError("No wishlist items found for this user", 404);
      return next(error);
    }
  }
}

// Get Wishlist By User
async function GetWishlistByUser(req, res, next) {
  let { userId } = req.params;
  const userWishlist = await wishlist.find({ UserId: userId });
  if (userWishlist && userWishlist.length > 0) {
    return res.status(200).json({
      Message: "Wishlist retrieved successfully",
      Data: userWishlist,
    });
  } else {
    const error = new ApiError("Wishlist is empty or not found", 404);
    return next(error);
  }
}

module.exports = {
  AddToWishlist,
  RemoveFromWishlist,
  ClearWishlist,
  GetWishlistByUser,
};
