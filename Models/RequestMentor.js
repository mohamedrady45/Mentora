const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
    track: String,
    languagePreference: String,
    genderPreference: String,
    type: { type: String, enum: ['one-time', 'long-term'] },
    // One-time session fields
    date: Date,
    timeAvailability: String,
    Reason: { type: String, enum: ['debug', 'code-review', 'consultation'] },
    // Long-term fields
    individualOrGroup: { type: String, enum: ['individual', 'group'] },
    oneToOneOrGroupTraining: { type: String, enum: ['one-to-one', 'training-group'] },
    duration: {
        from: Date,
        to: Date
    },
    minSalary: Number,
    maxSalary: Number,
    // Group specifics
    groupSize: Number, // Only for long-term group mentoring
});

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);

module.exports = MentorRequest;
