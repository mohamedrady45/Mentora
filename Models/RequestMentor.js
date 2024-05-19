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
    track: {
        type: String,
        enum: ['Frontend', 'Backend']
    },
    languagePreference: {
        type: String,
        enum: ['English', 'Arabic']
    },
    genderPreference: String,
    type: { type: String, enum: ['one-time', 'long-term'] },
    // One-time session fields
    date: Date,
    Reason: { type: String, enum: ['debug', 'code-review', 'consultation'] },

    duration: {
        from: Date,
        to: Date
    },
    minSalary: Number,
    maxSalary: Number,


});

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);

module.exports = MentorRequest;
