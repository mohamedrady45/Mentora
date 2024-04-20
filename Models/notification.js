const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    Type: {
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