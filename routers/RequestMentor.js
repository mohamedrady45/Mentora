const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/mentorRequestController');
const isAuth = require('../services/isAuth');
// Route to handle mentor requests
router.post('/mentor-request',isAuth , mentorRequestController.createMentorRequest);

module.exports = router;