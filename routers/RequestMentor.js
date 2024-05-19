const express = require('express');
const router = express.Router();
const mentorRequestController = require('../controllers/MentorRequestController');
const isAuth = require('../middlewares/isAuth');


router.post('/',isAuth , mentorRequestController.createMentorRequest);


module.exports = router;