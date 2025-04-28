const mongoose = require('mongoose');

const MemorizationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  note: {
    type: String,
    required: [true, 'Please add a note'],
    maxLength: [500, 'Note cannot be more than 500 characters']
  },
  dateAdded: {
    type: Date,
    default: Date.now
    },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true
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

module.exports = mongoose.model('Memorization', MemorizationSchema);