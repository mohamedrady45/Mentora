const express = require('express');
const isAuth = require('../middlewares/isAuth');

const ApplyAsMentorController = require('../controllers/ApplyAsMentorController');
const upload=require('../middlewares/uploadFile');
const router = express.Router();

////http://localhost:4000/api/Application
router.post('/', isAuth, ApplyAsMentorController.ApplyAsMentor );
router.get('/getAllApplications', isAuth, ApplyAsMentorController.getAllApplications);


module.exports = router;