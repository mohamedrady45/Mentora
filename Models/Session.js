const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sessionSchema = new Schema({
    mentor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    mentees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    training: {
        type: Schema.Types.ObjectId,
        ref: 'Training'
    },
    isConfirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    matrial: {
        type: {
            text: String,
            Attachments: Array
        },
        default: {
            text: 'No Material',
            Attachments: []
        }

    }


},
    {
        timestamps: true
    }
)

const SessionModel = mongoose.model("Session", sessionSchema);
module.exports = SessionModel;