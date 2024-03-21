const express = require('express');

//const messagesController = require('../controllers/messagesController');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')
const chatController=require('../controllers/chatController2')


const router = express.Router();



router.post('/', isAuth ,upload.array('files'), chatController.sendMessage );  //add a new message to the database
router.get('/getChats', isAuth, chatController.getUserChats);

// router.get('/:ChatId' , isAuth , messagesController.getMessages) ;   // get all messages from

// router.delete( '/:messageId' , isAuth, messagesController.deleteMessage);    // delete one specific message

// router.put('/:messageId' , isAuth , messagesController.updateMessage);   // update one specific message

module.exports = router;