const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
   text:{
    type: String,  
    required: true 
   },
    fileURL:{
        type:String, 
        default:"",
    }
},
    {
        timestamps: true
    })
const message = mongoose.model("Message", messageSchema);
module.exports = message;