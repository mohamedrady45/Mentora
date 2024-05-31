const mongoose = require('mongoose');
const MentorSchema =require('./message')

const TrainingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    track: {
        type: String,
        required: true,
    },
    level:{
        type: String,
        enum:['begineers', 'advanced'],
    },
    TrainingPicture: {
        type: String,
    },
    requirements:{
        type: String,
    },
    Salary: {
        type: Number,
        required: true,
    },
    duration: {
        type:Date,
        required: true,
    },
    numberOfRequiredMentees: {
        type: Number,
    },
    mentor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'finished'],
        default: 'pending'
    },
    language: {
        type: String,
        enum: ['English', 'Arabic']
    },
    mentees:{
        type:{
          counter: Number,
          menteeId: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
          }]
        },
        default: {
            counter: 0,
            menteeId: []
        },
        required: true,
    },
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
    
});

const Training = mongoose.model('Training', TrainingSchema);
module.exports = Training;