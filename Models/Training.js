const { duration } = require('moment');
const mongoose = require('mongoose');
const TrainingSchema = new mongoose.Schema({
    trainingType:{
        type: String,
        enum:['one-time', 'long-term'] ,
        required: true,
    },
    mentor:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    duration:{
        from: Date,
        to: Date
    },
    mentees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    track: [{
        type: String,
        required: true,
    }],
    Salary:{
        type: Number,
        required: true,
    }
    
});
  
const Training = mongoose.model('Training',TrainingSchema);
module.exports = Training;
  