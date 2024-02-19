const chatModel = require('../Models/chat')

class chatService {
   
    static async findChat(query)
    {
      return  await chatModel.findOne(query).exec() ;
    }
    static async findChatS(query)
    {
      return  await chatModel.find(query).exec() ;
    }
    static async createNewChat(chat)
    {
        const newChat =  new chatModel({
            members:[chat.firstId,chat.secondId],
            messages:[]
        })
      return  await  newChat.save();
    }
   
   
}
  
  module.exports = chatService;