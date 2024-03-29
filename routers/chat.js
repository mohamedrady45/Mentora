const express = require('express');

const chatController = require('../controllers/chatController2');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')

const router = express.Router();

// router.post('/createChat', isAuth, chatController.createChat);

// router.get('/getChats', isAuth, chatController.getUserChats);

router.post('/', isAuth ,upload.array('files'), chatController.sendMessage );  //add a new message to the database
router.get('/getChats', isAuth, chatController.getUserChats);
router.get('/getChat/:chatId', isAuth, chatController.findChat);

module.exports = router;