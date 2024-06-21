const mongoose = require('mongoose');
const Training = require('./Training');

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

const submissionSchema = new mongoose.Schema({
    task:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    file: {
        type: attachmentSchema,
        required: true,
    },

    review: {
        type: String,
        required: true,
        default: 'you don\'t has reviwe yet'
    }
});


const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;