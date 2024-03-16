const chatService = require('../Services/chat')
const Message = require("../Models/message")
const User = require("../Models/user")



const createChat = async (req, res, next) => {
    try {
        //get users Id
        const { firstId, secondId } = req.body;

        //check if chat already  exists between the two users
        const chat = await chatService.findChat({ members: { $all: [firstId, secondId] } });
        if (chat) {//if yes return it
            return res.status(201).json({ success: true, data: chat });
        }

        //else create a new one and save it to DB
        const newChat = await chatService.createNewChat(req.body);
        const fristUser=await User.findById(newChat.members[0]);
        const secondUser=await User.findById(newChick.members[1]);
        fristUser.chats.push(newChat._id);
        secondUser.chats.push(newChat._id);
        await fristUser.save();
        await secondUser.save();
        return res.status(201).json({ success: true, data: newChat });


    }
    catch (err) {
        console.log("craete chat error");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
const getUserChats = async (req, res, next) => {
    
    try {
        //get user Id
        const userId = req.userId;
        //find  all chats where this user is member
        const chats = await chatService.findChatS({ members: { $in: [userId] } });

        // // get users data
        // const userIds = chats.map(c => c.members.filter(id => id.toString() !== userId));
        // const users = await Promise.all(userIds.map((ids) => User.find({ _id: { $in: ids } })))
        //     .then(result => result.reduce((acc, item) => { acc.push(...item); return acc }, []));

        // //FIXME:
        
        // chats.map(async chat => {
        //     const lastMsgId = chat.messages[chat.messages.length - 1];
        //     const msg = await Message.findById(lastMsgId);
        //    chat.last_message = msg;
        // })
        // console.log(chats)

        // // add users info to each chat
        // chats.forEach((chat, i) => {
        //     chat.members = users[i];
        // })
       

        res.status(200).json({ success: true, chats: chats })


    }
    catch (err) {
        console.log("get user chats error");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const findChat = async (req, res, next) => {
    try {
        //get users Id
        const { firstId, secondId } = req.pramas;

        //check if chat already  exists between the two users
        const chat = await chatService.findChat({ members: { $all: [firstId, secondId] } });
        if (!chat) {
            return res.status(404).json({ success: false, message: "No chat found" });
        }
        //send back the chat

        return res.status(201).json({ success: true, data: chat });

    }
    catch (err) {
        console.log("craete chat error");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
module.exports = {
    createChat,
    getUserChats,
    findChat
}