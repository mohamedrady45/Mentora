const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController'); 
const isAuth = require('../middlewares/isAuth');

router.post('/createNewCommunity', isAuth , communityController.createCommunity);

router.get('/getAllCommunities', isAuth, communityController.getAllCommunities)

router.get('/getUserCommunities', isAuth , communityController.getUserCommunities);

router.get('/searchCommunity', isAuth , communityController.searchCommunity);

router.get('/:communityId', isAuth , communityController.getCommunity);

router.get('/:communityId/getCommunityQuestions', isAuth , communityController.getCommunityQuestions);

router.get('/:communityId/questions/:questionId', isAuth , communityController.getOneCommunityQuestion);

router.post('/:communityId/join', isAuth , communityController.joinCommunity);

router.put('/:communityId/leave', isAuth  , communityController.leaveCommunity);

router.post('/:communityId/addQuestion', isAuth , communityController.addQuestion);

router.post('/:communityId/questions/:questionId/answerQuestion', isAuth ,communityController.answerQuestion);

router.get('/:communityId/questions/:questionId/answers',isAuth ,  communityController.getQuestionAnswers);

module.exports = router;
