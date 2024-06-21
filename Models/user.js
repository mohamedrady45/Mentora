const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['User', 'Admin', 'Mentor'],
        default: 'User',
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Validate date format (YYYY-MM-DD)
                if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
                    return false;
                }

                const eighteenYearsAgo = moment().subtract(18, 'years');
                if (moment(value).isAfter(eighteenYearsAgo)) {
                    return false;
                }

                return moment(value).isSameOrBefore(moment());
            },
            message: 'Please enter a valid date of birth (YYYY-MM-DD) and ensure you are at least 18 years old.',
        },
    },
    country: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: false,
    },
    bio: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    languages: {
        type: [String],
        default: [],
    },
    interests: {
        type: [String],
        default: [],
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    refreshToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    OTP: {
        type: String,
    },
    notification: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    }],
    followers: {
        type: {
            counter: Number,
            userIds: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }]
        },
        default: {
            counter: 0,
            userIds: []
        }
    },
    following: {
        type: {
            counter: Number,
            userIds: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }]
        },
        default: {
            counter: 0,
            userIds: []
        }
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    
    notification: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    trainings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
    }],
    isMentor: {
        type: Boolean,
        default: false,
    },
    mentorshipInfo: {
        track: {
            type: [String],
        },
        experience: {
            type: String,
        },
        LinkedinUrl: {
            type: String,
        },
        GithubUrl: {
            type: String,
        },
        CV: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        salary: {
            type: Number,
        },
    },
    requests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorRequest',

    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
