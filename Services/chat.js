const Message = require('../Models/message');
const User = require('../Models/user');
const Chat = require('../Models/chat');

class chatService {
   
    static async findChat(query)
    {
      return  await Chat.findOne(query).populate('members');
    }
    static async findChatS(query)
    {
      return  await Chat.find(query).exec() ;
    }
    static async createNewChat(chat)
    {
        const newChat =  new Chat({
            members:[chat.firstId,chat.secondId],
            messages:[]
        })
      return  await  newChat.save();
    }
   
   
}
  
  module.exports = chatService;