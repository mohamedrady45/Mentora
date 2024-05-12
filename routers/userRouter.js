const express = require('express');

const userController = require('../controllers/userController');
const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')

const router = express.Router();


router.get('/',isAuth,userController.getUser);
router.put('/updateUserData',isAuth,upload.single('image'),userController.editUserData);
router.put('/followUser/:followId',isAuth,userController.followUser);

module.exports = router;