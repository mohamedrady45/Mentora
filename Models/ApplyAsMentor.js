const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    track: [{
        type: String,
        required: true,
    }],
    experience: {
        type: String,
        required: true,
    },
    YearOfExperience: {
        type: Number,
    },
    LinkedinUrl: {
        type: String,
        required: true,
    },
    GithubUrl: {
        type: String,
        required: true,
    },
    CV: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
            require: true,
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'], 
        default: 'pending' 
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;
