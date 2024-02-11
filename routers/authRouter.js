const express = require('express');

const authController = require('../controllers/authController');


const router = express.Router();
router.get('/getAll'  ,  authController.getAllUsers)
router.post('/register', authController.register);
router.post('/verifyOTP', authController.verifyOTP);
//http://localhost:3000/api/login
router.post('/login', authController.login);
router.post('facebooklogin',authController.facebookLogin)

//google Auth
router.post('/googlelogin',authController.googlelogin);

router.post('/resetPassword',authController.resetPassword);


router.post('/refreshToken',authController.refreshToken);


module.exports = router;