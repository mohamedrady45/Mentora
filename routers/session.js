const express = require('express');
const router = express.Router();

const sessionController = require('../controllers/SessionController');

const isAuth = require("../middlewares/isAuth");
const upload=require('../middlewares/uploadFile')


router.post('/:reqId', isAuth , sessionController.createSession );  


module.exports = router;