const express = require('express');

const messagesController = require('../controllers/messagesController');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')


const router = express.Router();

TODO:

router.post('/', isAuth ,upload.single('lol'), messagesController.createMessage );  //add a new message to the database

router.get('/:ChatId' , isAuth , messagesController.getMessages) ;   // get all messages from

router.delete( '/:messageId' , isAuth, messagesController.deleteMessage);    // delete one specific message

router.put('/:messageId' , isAuth , messagesController.updateMessage);   // update one specific message

module.exports = router;