const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/send-OTP', authController.sendOTP);
router.post('/verify-OTP', authController.verifyOTP);
//localhost:3000/api/user/reset-password
router.post('/reset-password', authController.resetPassword);

router.post('/login', authController.login);

module.exports = router;