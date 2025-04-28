const express = require("express");
const router = express.Router();
const FavoriteController = require("../Controllers/FavoriteController");
const isAuthorize = require('../Middlewares/Authorization');

// Get all favorites for the user
router.get("/get-all", isAuthorize(['User', 'Admin']), FavoriteController.getFavorites);

// Add a new favorite
router.post("/add-favorite", isAuthorize(['User', 'Admin']), FavoriteController.addFavorite);

// Remove a favorite
router.delete("/remove-favorite/:id", isAuthorize(['User', 'Admin']), FavoriteController.removeFavorite);

module.exports = router;