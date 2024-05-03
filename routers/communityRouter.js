const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController'); 
const isAuth = require('../middlewares/isAuth');
router.post('/createNewCommunity', isAuth , communityController.createCommunity);

router.post('/:communityId/join', isAuth , communityController.joinCommunity);

router.post('/:communityId/leave', isAuth  , communityController.leaveCommunity);

router.post('/:communityId/addQuestion', isAuth , communityController.addQuestion);

router.post('/:communityId/questions/:questionId/answerQuestion', isAuth ,communityController.answerQuestion);

module.exports = router;
