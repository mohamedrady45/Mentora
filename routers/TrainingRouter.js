const express = require('express');
const TrainingController = require('../controllers/TrainingController');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();

//http://localhost:4000/api/training
router.get('/',isAuth, TrainingController.getAllTrainings);
router.post('/create-training', isAuth, TrainingController.createTraining);
router.put('/:id',isAuth, TrainingController.updateTraining);
router.delete('/:id',isAuth, TrainingController.deleteTraining);

module.exports = router;