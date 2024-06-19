const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/MentorRequestController');
const isAuth = require('../middlewares/isAuth');

//http://localhost:4000/api/request
router.post('/mentor-request',isAuth , mentorRequestController.createMentorRequest);
router.get('/recommend-mentors', mentorRequestController.getMentorsRecommendation);
router.post('/:id/request',isAuth, mentorRequestController.RequestRecommendedMentor);
router.post('/:id/reject-request',isAuth, mentorRequestController.MentorRejectRequest);
router.post('/:id/accept-request', isAuth, mentorRequestController.MentorAcceptedRequest);
module.exports = router;