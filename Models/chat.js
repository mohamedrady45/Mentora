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
            type: Schema.Types.ObjectId,
            ref: 'Message',
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