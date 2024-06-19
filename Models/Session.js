const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  mentees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  meetingLink: {
    type: String 
  },
  training: {
    type: Schema.Types.ObjectId,
    ref: 'Training'
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  material: {
    type: {
      text: String,
      attachments: Array
    },
    default: {
      text: 'No Material',
      attachments: []
    }
  }
}, {
  timestamps: true
});

const SessionModel = mongoose.model('Session', sessionSchema);
module.exports = SessionModel;
