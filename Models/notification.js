const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['comment', 'reply','question'],
        required: true,
    }
},
    {
        timestamps: true
    }
)
const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;