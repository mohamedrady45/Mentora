const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    user: [
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
        enum: ['Male', 'Female'],
        required: true,
    }
},
    {
        timestamps: true
    }
)
const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;