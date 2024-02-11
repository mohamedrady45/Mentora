// models/message.js
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
    reacts: {
      type: reactionSchema,
      default: {},
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
  
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reacts: {
    type: reactionSchema,
    default: {},
  },
  attachments: [attachmentSchema],
  replay: [replySchema],
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
