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
    date:{
        type: Date,
        required: true,
        default: Date.now
    },
    picture:{
        type: String,
        required: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['Comment', 'Reply','Share','Post'],
        required: true,
    },
    ref:{
        type: Schema.Types.ObjectId,
        refPath: `${this.type}`
    }
},
    {
        timestamps: true
    }
)
const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;