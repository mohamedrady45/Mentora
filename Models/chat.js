const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    members:Array,
    messages:{type:Array},
})
const  ChatModel = mongoose.model("Chat",chatSchema);
module.exports=ChatModel;