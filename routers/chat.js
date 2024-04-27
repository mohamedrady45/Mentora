const express = require('express');

const chatController = require('../controllers/chatController');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')

const router = express.Router();



router.post('/', isAuth ,upload.array('files'), chatController.sendMessage );  
router.get('/getChats', isAuth, chatController.getUserChats);
router.get('/findChat/:chatId', isAuth, chatController.findChat);
router.put('/editMessage/:messageId', isAuth, chatController.updateMessage );
router.put('/markMesageAsReaded/:messageId',isAuth,chatController.markMesageAsReaded)
router.delete('/deleteMessage/:messageId', isAuth, chatController.deleteMessage );
module.exports = router;