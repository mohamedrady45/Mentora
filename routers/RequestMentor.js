const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/mentorRequestController');

// Route to handle mentor requests
router.post('/mentor-request', (req, res) => {
    mentorRequestController.createMentorRequest(req, res, req.user.id);
});

module.exports = router;