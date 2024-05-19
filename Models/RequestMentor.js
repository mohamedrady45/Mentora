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
    languagePreference: {
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
});

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);

module.exports = MentorRequest;
