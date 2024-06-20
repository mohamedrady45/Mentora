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
  },
  reviwe:{
    type:String,
    required: true,
    default:'you don\'t has reviwe yet'
  }
});
const submissionSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  file: {
    type: attachmentSchema,
    required: true,
  },
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
  submission:[submissionSchema]
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
