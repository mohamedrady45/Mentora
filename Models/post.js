const mongoose = require('mongoose');

// Schema for Share
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

// Schema for Attachment
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

// Schema for Reaction
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

// Schema for Reply
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

// Schema for Comment
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

// Schema for Post
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

// Creating Models
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);
const Share = mongoose.model('Share', shareSchema);

// Exporting Models
module.exports = { Post, Comment, Reply, Share };
