const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({

    senderID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: String,
    isRead: {
        type: Boolean,
        default: false
    },
    files: [{
        fileType: String,
        filePath: String
    }],
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        //required: true
    },

},
    {
        timestamps: true
    }
)

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;