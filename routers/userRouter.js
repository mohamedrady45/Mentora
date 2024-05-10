const express = require('express');

const userController = require('../controllers/userController');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')

const router = express.Router();


router.get('/',isAuth,userController.getUser)

module.exports = router;