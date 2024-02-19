const express = require('express');

const chatController = require('../controllers/chatController');
const isAuth = require("../middlewares/isAuth");


const router = express.Router();

router.post('/createChat', isAuth, chatController.createChat);

router.get('/getChats', isAuth, chatController.getUserChats);

router.get('/getChat/:firstId/:secondId', isAuth, chatController.findChat);

module.exports = router;