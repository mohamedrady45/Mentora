const express = require('express');

const TrainingController = require('../controllers/TrainingController');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();
//http://localhost:4000/api/training

module.exports = router;