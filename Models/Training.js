const mongoose = require('mongoose');
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
    requirements: {
        type: String,
    },
    Salary: {
        type: Number,
        required: true,
    },
    duration: {
        from: Date,
        to: Date
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
    mentees: {
        type: {
            counter: Number,
            menteeId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }]
        },
        defult: {
            counter: 0,
            menteeId: []
        }
    },
    





});

const Training = mongoose.model('Training', TrainingSchema);
module.exports = Training;