const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  description: {
    type: String,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  track : {
    type : String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Question',
    default: [],
  },
}, {
  timestamps: true,
});



const Community = mongoose.model('Community', communitySchema);
module.exports = Community;