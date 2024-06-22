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
        required:true,
        default:'https://res.cloudinary.com/di4ytdfwq/image/upload/v1719032947/Training/dsdmijywhwkvrs4d6agq.png'
    },
    requirements:{
        type: String,
    },
    Salary: {
        type: Number,
        required: true,
    },
    duration: {
        type:String,
        required: true,
    },
    numberOfRequiredMentees: {
        type: Number,
    },
    mentor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    hasTest: {
        type: Boolean,
        default: false
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
    }],
    material:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Material'
    }]
});

const Training = mongoose.model('Training', TrainingSchema);
module.exports = Training;