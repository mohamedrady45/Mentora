const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default:Date.now

    },
    training:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Training'
    }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;