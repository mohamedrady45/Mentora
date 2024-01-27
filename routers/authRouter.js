const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/reset-password', authController.sendOTP);
router.post('/reset-password/verify', authController.verifyResetOTP);

module.exports = router;