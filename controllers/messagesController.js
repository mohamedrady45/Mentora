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
const deleteMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;


        const message = await Message.findOneAndDelete({ _id: messageId });
        if (!message) {
            return res.status(404).json({
                success: false,
                error: "Message not found"
            })
        }
        //remove the message from array in user chats collection

        return res.status(200).json({
            success: true,
            msg: `Message with id ${messageId} has been deleted`
        })

    } catch (err) {
        console.error('delete message failed', err);
        next(err);
    }
}


const updateMessage = async (req, res, next) => {
    const { messageId } = req.params;
    const updates = { ...req.body };

    /**
     * Fields to be updated must be provided in the request body
     */
    if (!Object.keys(updates).length) {
        return res.status(400).json({
            error: 'No fields provided to update'
        });
    }

    /**
     * Create or update a field only if it exists in the model and allowed for updating
     */
    try {
        let message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                error: `The message with the id of "${messageId}" does not exist.`
            })
        }

        //Return updated message
        const updatedMessage = await Message.findByIdAndUpdate(messageId, updates, { new: true })
            .populate('author')
            .exec();
        res.status(201).json({ message: updatedMessage });
    } catch (e) {
        console.log(e);
        next(err);
    }
}
module.exports = {
    createMessage,
    getMessages,
    deleteMessage,
    updateMessage

};