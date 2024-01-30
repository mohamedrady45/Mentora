const mongoose = require('mongoose');
const shareSchema = new mongoose.Schema({
    user: {
      type: ObjectId,
      ref: 'User',
    },
    dateShared: {
      type: Date,
      default: Date.now,
    },
  });
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
const reactionSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  users: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
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

const commentSchema = new mongoose.Schema({
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
  replies: [replySchema],
});

const postSchema = new mongoose.Schema({
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
  attachments: [attachmentSchema],
  comments: [commentSchema], 
  shares : [shareSchema],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
