const ChatModel = require("../Models/chat");
const UserModel = require("../Models/user");
const upload = require("../middlewares/uploadFile");

const sendMessage = async (req, res, next) => {
    try {
        const senderID = req.userId;
        const resecerID = req.body.resecerId;
        const files = req.files;


        const Nfiles = files.map(async file => {
            //Get the path to the image
            const imagePath = file.path;
            //Upload to cloudinary
            const result = await cloudinaryUploadImage(imagePath)
            console.log(result);

            //Remove image from the server
            fs.unlinkSync(imagePath)

            return {
                fileType: file.mimetype,
                filePath: result,
            }
        });
        //TODO: msg is read
        const Nmsg = {
            senderID: senderID,
            message: req.body.message,
            files: Nfiles,
        }
        let chat = await ChatModel.findOne({ users: { $all: [senderID, resecerID] } });
        if (!chat) {
            // create new chat between the two users
            chat = new ChatModel({
                users: [senderID, resecerID],
            })
            await chat.save();

            const user1 = await UserModel.findById(senderID);
            const chats1 = user1.chats;
            chats1.push(chat._id);
            user1.chats = chats1;
            await user1.save();


            const user2 = await UserModel.findById(resecerID);
            const chats2 = user2.chats;
            chats2.push(chat._id);
            user2.chats = chats2;
            await user2.save();
        }

        const messages = chat.messages;
        messages.push(Nmsg);
        chat.messages = messages;
        await chat.save();

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
        const user = await UserModel.findById(userId).populate({
            path: 'chats',
            populate: {
                path: 'users'
            }
        });

        if (!user || !user.chats) {
            return res.status(401).json({ success: false, message: 'Error in find chats' })
        }
        //array of {last message ,user name,user  image}
        const data = user.chats.map((chat) => {
            const secUser = chat.users.filter(user => user._id !== userId);
            console.log()
            return {
                _id: chat._id,
                user: {
                    name: secUser[0].firstName + ' ' + secUser[0].lastName,
                    //TODO:image:secUser[0].image?`/images/${secUser[0].image}`:"/images/default_avatar.png",
                },
                last_message: chat.messages[chat.messages.length - 1]
            };
        })
        res.status(200).json({ success: true, data: data });

    } catch (err) {
        console.log("craete chat error");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


module.exports = {
    sendMessage,
    getUserChats
}