const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  answers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Answer', 
    default: [],
  },
}, {
  timestamps: { updatedAt: 'updatedAt' }, 
});

module.exports = mongoose.model('Question', questionSchema);
