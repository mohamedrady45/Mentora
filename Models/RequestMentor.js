const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:['reject','pendening','accepted'],
        default:'pendening'
    },
    track: {
        type: String,
        enum: ['Frontend', 'Backend']
    },
    language: {
        type: String,
        enum: ['English', 'Arabic']
    },
    genderPreference: {
        type: String,
        enum: ['Male', 'Female']
    },
    type: { type: String, enum: ['one-time', 'long-term'] },

    Reason: {
        type: String,
        enum: ['debug', 'code-review', 'consultation']
    },

    duration: {
        from: Date,
        to: Date
    },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'], // Possible statuses of the request
        default: 'pending'
    },
});

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);

module.exports = MentorRequest;
