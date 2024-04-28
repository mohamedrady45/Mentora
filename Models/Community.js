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

communitySchema.pre('save', async function (next) {
  try {
    if (this.isNew && this.members.length) {
      const duplicate = await this.model('Community').findOne({
        members: { $in: this.members },
        _id: { $ne: this._id },
      });
      if (duplicate) {
        throw new Error('A user cannot be a member of the same community twice.');
      }
    }
    next();
  } catch (error) {
    next(error); 
  }
});

module.exports = mongoose.model('Community', communitySchema);
