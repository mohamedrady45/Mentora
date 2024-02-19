const chatService = require('../Services/chat')


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