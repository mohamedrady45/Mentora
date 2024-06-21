const mongoose = require('mongoose');


const attachmentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'file'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
});


const taskSchema = new mongoose.Schema({
  
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
  },
  deadline: {
    type: Date,
  },
  attachment: { type: attachmentSchema },
  submissions:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Submission'
  }]
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
