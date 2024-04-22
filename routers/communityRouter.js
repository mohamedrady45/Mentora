const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController'); 

router.post('/communities/createNewCommunity', communityController.createCommunity);

router.post('/communities/:communityId/join', communityController.joinCommunity);

router.post('/communities/:communityId/leave', communityController.leaveCommunity);

router.post('/communities/:communityId/addQuestion', communityController.addQuestion);

router.post('/communities/:communityId/questions/:questionId/answerQuestion', communityController.answerQuestion);

module.exports = router;
