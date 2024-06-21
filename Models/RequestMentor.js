const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    track: {
        type: String,
        enum: ['Frontend', 'Backend']
    },
    languagePreference: {
        type: String,
        enum: ['English', 'Arabic']
    },
    genderPreference: {
        type: String,
        enum: ['Male', 'Female']
    },
    type: {
        type: String,
        enum: ['one-time', 'long-term']
    },
    Reason: {
        type: String,
        enum: ['debug', 'code-review', 'consultation']
    },
    minSalary: {
        type: Number
    },
    maxSalary: {
        type: Number
    },
    sessionDate: {
        type: Date,
        // required: true
    },
    startTime: {
        type: String,
        // required: true
    },
    endTime: {
        type: String,
        // required: true
    }
});

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);

module.exports = MentorRequest;
