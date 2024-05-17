const express = require('express');
const isAuth = require('../middlewares/isAuth');

const ContactController = require('../controllers/ContactController');
const router = express.Router();

//http://localhost:4000/api/findMentor
router.post('/search', isAuth, ContactController.Search);
router.post('/id/request', isAuth, ContactController.RequestRecommendedMentor);
router.post('/id', isAuth, ContactController.MentorAcOrRejRequest);

module.exports = router;