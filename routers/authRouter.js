const express = require('express');

const authController = require('../controllers/authController');


const router = express.Router();


router.get('/getAll'  ,  authController.getAllUsers)
router.post('/register', authController.register);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/login', authController.login);
router.post('facebooklogin',authController.facebookLogin)
router.post('facebookRegister',authController.facebookRegister)
router.post('/googlelogin',authController.googlelogin);
router.post('/googleRegister',authController.googleRegister);

module.exports = router;