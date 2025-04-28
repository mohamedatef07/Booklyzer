const Favorite = require('../Models/Favorite');
const Book = require('../Models/Book');
const ApiError = require("../Utils/ApiError");

async function addFavorite(req, res, next) {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      const error = new ApiError(`Book not found with id of ${bookId}`, 404);
      return next(error);
    }

    let favorite = await Favorite.findOne({
      book: bookId,
      user: req.user.id
    });

    if (favorite) {
      favorite.count += 1;
      await favorite.save();
    } else {
      favorite = await Favorite.create({
        book: bookId,
        user: req.user.id,
        count: 1
      });
    }

    res.status(201).json({ success: true, data: favorite });
  } catch (err) {
    const error = new ApiError("Server error", 500);
    return next(error);
  }
}

async function getFavorites(req, res, next) {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'book',
        select: 'title author imageURL'
      });

    res.status(200).json({ 
      success: true, 
      count: favorites.length, 
      data: favorites 
    });
  } catch (err) {
    const error = new ApiError("Server error", 500);
    return next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      const error = new ApiError(`Favorite not found with id of ${req.params.id}`, 404);
      return next(error);
    }

    if (favorite.user.toString() !== req.user.id) {
      const error = new ApiError("Not authorized to remove this favorite", 401);
      return next(error);
    }

    await favorite.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    const error = new ApiError("Server error", 500);
    return next(error);
  }
}

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
};