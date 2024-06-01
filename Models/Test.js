const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    options: [{ type: String }],
    answer: {
        type: Number,
        required: true
    }
});


const testSchema = new mongoose.Schema({
    trainingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training',
        required: true,
    },
    questions: [questionSchema],
    passScore: {
        type: Number,
        required: true,
        default: 0
    },
    passed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model('Test', testSchema);
