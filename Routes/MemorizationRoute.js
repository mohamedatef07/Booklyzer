const express = require('express');
const router = express.Router();
const MemorizationController = require('../Controllers/MemorizationController');
const isAuthorize = require('../Middlewares/Authorization');

// Get all memorizations for the user
router.get('/get-all', isAuthorize(['User', 'aAmin']), MemorizationController.getMemorizations);

// Create a new memorization
router.post('/create-memorization', isAuthorize(['User', 'Admin']), MemorizationController.createMemorization);

// Update an existing memorization
router.put('/update-memorization/:id', isAuthorize(['User', 'Admin']), MemorizationController.updateMemorization);

// Soft delete a memorization
router.delete('/delete-memorization/:id', isAuthorize(['User', 'Admin']), MemorizationController.deleteMemorization);

module.exports = router;