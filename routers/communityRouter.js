const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController'); 

router.post('/createNewCommunity', communityController.createCommunity);

router.post('/:communityId/join', communityController.joinCommunity);

router.post('/:communityId/leave', communityController.leaveCommunity);

router.post('/:communityId/addQuestion', communityController.addQuestion);

router.post('/:communityId/questions/:questionId/answerQuestion', communityController.answerQuestion);

module.exports = router;
