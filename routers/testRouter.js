const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');
const isAuth = require("../middlewares/isAuth");



router.post('/', isAuth , testController.addTest );  
router.get('/:trainingId', isAuth , testController.getTest );  
router.post('/submit', isAuth , testController.submitTest );  

module.exports = router;