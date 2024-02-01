const express = require('express');

const authController = require('../controllers/authController');


const router = express.Router();
router.get('/getAll'  ,  authController.getAllUsers)
router.post('/register', authController.register);
router.post('/verifyOTP', authController.verifyOTP);

//router.post('/reset-password/verify', authController.verifyResetOTP);

router.post('/login', authController.login);

module.exports = router;