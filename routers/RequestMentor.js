const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/MentorRequestController');
const isAuth = require('../middlewares/isAuth');

router.post('/',isAuth , mentorRequestController.createMentorRequest);
router.post('/recommend-mentors/:id', mentorRequestController.getMentorsRecommendation);
router.post('/:id/request', mentorRequestController.RequestRecommendedMentor);
router.post('/reject-request',mentorRequestController.MentorRejectRequest)

module.exports = router;