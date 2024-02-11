const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video' , 'file'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
const replySchema = new mongoose.Schema({
    author: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reacts: {
        type: reactionSchema,
        default: {},
      },
  });

const chatSchema = new mongoose.Schema({
        author: {
          type: ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        timestamp: { type: Date, default: Date.now },
  
});

const Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;