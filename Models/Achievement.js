const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  achievementName: {
    type: String,
    required: [true, 'Please add an achievement name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  iconUrl: {
    type: String
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', AchievementSchema);