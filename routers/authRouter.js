const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.get('/getAll'  ,  authController.getAllUsers)

router.post('/register', authController.register);

module.exports = router;
