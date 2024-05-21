const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true ,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default:Date.now
  },
  deadline: {
    type: Date,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session', 
    required: true,
  },
  
  
});

module.exports = mongoose.model('Task', taskSchema);
