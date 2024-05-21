const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
  },
  solutions:{
    type:{
        solution: String,
        
    }
  }

});

module.exports = mongoose.model('Task', taskSchema);
