const ChatModel = require("../Models/chat");
const UserModel = require("../Models/user");
const MassageModel = require('../Models/message')
const { getReceiverSocketId, io } =require('../Socket/socket');



const sendMessage = async (req, res, next) => {
    try {
        const senderID = req.userId;
        const receiveID = req.body.receiveId;
        console.log(senderID,receiveID);
        const files = req.files;


        const Nfiles = files.map(file => {
            return {
                fileType: file.mimetype,
                filePath: file.path
            }
        });

        let chat = await ChatModel.findOne({ users: { $all: [senderID, receiveID] } });
        if (!chat) {
            // create new chat between the two users
            chat = new ChatModel({
                users: [senderID, receiveID],
            })
            await chat.save();

            const user1 = await UserModel.findById(senderID);
            const chats1 = user1.chats;
            chats1.push(chat._id);
            user1.chats = chats1;
            await user1.save();


            const user2 = await UserModel.findById(receiveID);
            const chats2 = user2.chats;
            chats2.push(chat._id);
            user2.chats = chats2;
            await user2.save();
        }
       
        const Nmsg = new MassageModel({
            chatId: chat._id,
            senderID: senderID,
            message: req.body.message,
            files: Nfiles,
        })
        await Nmsg.save();

        chat.messages.push(Nmsg);
        await chat.save();

        // SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiveID);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}
        TODO:
        // io.to(`${senderID}`).emit('getMessage',Nmsg);
        // io.to(`${resecerID}`) .emit('getReceiveMessage',Nmsg);

        // io.to(`${senderID}`).emit('getMessage', Nmsg);

        // // Emit message to receiver
        // io.to(`${receiveID}`).emit('getReceiveMessage', Nmsg);

        res.status(200).json({ success: true, data: "Message Sent" });

    } catch (err) {
        console.log("craete chat error");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const getUserChats = async (req, res, next) => {
    try {
        const userId = req.userId;
        console.log(userId)
        const user = await UserModel.findById(userId).populate({
            path: 'chats',
            populate: {
                path: 'users',
                select: 'firstName lastName'
            }
        });

        if (!user || !user.chats) {
            return res.status(401).json({ success: false, message: 'Error in find chats' })
        }
        //array of {last message ,user name,user  image}
        const data = user.chats.map(async (chat) => {
            const secUser = chat.users.filter(user => user._id != userId);
            const lst_msg_id = chat.messages[chat.messages.length - 1];
            let lst_msg = await MassageModel.findOne({ _id: lst_msg_id });

            return {
                _id: chat._id,
                user: secUser,
                last_message: lst_msg,
            };
        })

        Promise.all(data)
            .then((result) => {

                return res.status(200).json({ success: true, data: result });
            })

    } catch (err) {
        console.log("craete chat error");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const findChat = async (req, res, next) => {
    try {

        const chatId = req.params.chatId;
        const chat = await ChatModel.findOne({ _id: chatId }).populate('users', 'firstName lastName ').populate('messages');
        if (!chat) {
            return new Error('chat not found').statusCode = 404;
        }
        res.status(200).json({ success: true, data: chat });

    } catch (err) {
        console.log("error in find chat");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const updateMessage = async (req, res, next) => {
    try {

        const messageId = req.params.messageId;
        const newMessage = req.body.message;
        const message = await MassageModel.findById(messageId);
        if(!message){
         return res.status(400).json({success : false , msg:"No such Message"});
        }
        if (message.senderID != req.userId) {
            return new Error('Unauthorized access', 'You are not the sender of this message').statusCode = 401;
        }
        message.message = newMessage;
        await message.save();
        return res.status(201).json({ success: true, msg:'message updated' });


    } catch (err) {
        console.log("error in edit message");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

const deleteMessage = async (req, res, next) => {
    try {

        const messageId = req.params.messageId;
        
        const message = await MassageModel.findById(messageId);
        if(!message){
         return res.status(400).json({success : false , msg:"No such Message"});
        }
        if (message.senderID != req.userId) {
            return new Error('Unauthorized access', 'You are not the sender of this message').statusCode = 401;
        }

        //remove  the messge from chat messages array
        let chat = await ChatModel.findOne({_id:message.chatId});
        chat.messages = chat.messages.filter((m)=> m!=messageId );
        await chat.save();
        
        //delete the message
        await message.deleteOne();
        return res.status(201).json({ success: true, msg:'message deleted' });


    } catch (err) {
        console.log("error in edit message");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}
 
 const markMesageAsReaded =async (req,res,next)=>{
    try {
        const messageId = req.params.messageId;
        const message = await MassageModel.findById(messageId);
        if(!message){
         return res.status(400).json({success : false , msg:"No such Message"});
        }
       
        message.isRead = true;
        await message.save();
        return res.status(201).json({ success: true, msg:'message updated' });

    } catch (err) {
        console.log("error in edit message");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


 }
module.exports = {
    sendMessage,
    getUserChats,
    findChat,
    updateMessage,
    deleteMessage,
    markMesageAsReaded
}