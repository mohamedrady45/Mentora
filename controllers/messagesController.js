const Message = require('../Models/message')
const io = require("../socket")

const createMessage = async (req, res, next) => {
    try {
        const { chatId, senderId, text } = req.body;
        const message = new Message({ chat: chatId, sender: senderId, text });
        await message.save();
        
        //socket io connection
        io.gitIO.emit('create_msg', { action: "Create", message: message });

        return res.status(201).json({
            success: true,
            data: message
        })
    } catch (err) {
        console.error('send message faild', err);
        next(err);
    }
}

const getMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chat: chatId }).sort({ 'createdAt': -1 }).populate(['sender', 'chat']);

        if (!messages || messages.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No Messages Found'
            });
        };
        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        })

    } catch (err) {
        console.error('send message faild', err);
        next(err);
    }
}
module.exports = {
    createMessage,
    getMessages,

};