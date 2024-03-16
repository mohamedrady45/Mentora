const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: {
                message: String,
                senderID: { type: Schema.Types.ObjectId, ref: 'User' },
                time: {type:Date,default:Date.now}  ,
                isRead: { type: Boolean, default: false },
                files: [{ fileType: String, filePath: String }] //array of objects with filenames and paths     
            },
            require: true,
        }
    ]
},
    {
        timestamps: true
    }
)
const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;