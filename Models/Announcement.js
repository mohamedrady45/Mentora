const mongoose = require('mongoose');
const Training = require('./Training');
const AnnouncementSchema = new mongoose.Schema({
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

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;