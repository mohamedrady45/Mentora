const express = require('express');

const notificationController = require('../controllers/notificationController');
const isAuth = require("../middlewares/isAuth");


const router = express.Router();


 
router.get('/allNotification', isAuth, notificationController.gitAllNotification);
router.put('/notificationIsReaded/:notificationId', isAuth, notificationController.notificationIsReaded );
router.delete('/deleteNotification/:notificationId', isAuth, notificationController.deleteNotification);
module.exports = router;