const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  dateShared: {
    type: Date,
    default: Date.now,
  },
});

const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'file'],
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
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
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
});

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
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
  attachments: [attachmentSchema],
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
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
  shares: {
    type: shareSchema,
    default: {},
  },
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);
const Share = mongoose.model('Share', shareSchema);

module.exports = { Post, Comment, Reply, Share };
