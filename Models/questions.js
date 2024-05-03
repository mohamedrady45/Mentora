const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
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
  answers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Answer', 
    default: [],
  },
}, {
  timestamps: { updatedAt: 'updatedAt' }, 
});

module.exports = mongoose.model('Question', questionSchema);
