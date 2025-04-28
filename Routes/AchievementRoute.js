const express = require('express');
const router = express.Router();
const AchievementController = require('../Controllers/AchievementController');
const isAuthorize = require('../Middlewares/Authorization');

// Get all achievements for the user
router.get('/get-all', isAuthorize(['User', 'Admin']), AchievementController.getAchievements);

// Create a new achievement
router.post('/create-achievement', isAuthorize(['User', 'Admin']), AchievementController.createAchievement);

// Update an existing achievement
router.put('/update-achievement/:id', isAuthorize(['User', 'Admin']), AchievementController.updateAchievement);

// Soft delete an achievement
router.delete('/delete-achievement/:id', isAuthorize(['User', 'Admin']), AchievementController.deleteAchievement);

module.exports = router;