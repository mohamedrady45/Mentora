const express = require('express');
const TrainingController = require('../controllers/TrainingController');
const isAuth = require('../middlewares/isAuth');
const upload=require('../middlewares/uploadFile')
const router = express.Router();

//http://localhost:4000/api/training
router.get('/',isAuth, TrainingController.getAllTrainings);
router.post('/create-training', isAuth, TrainingController.createTraining);
router.put('/:id',isAuth, TrainingController.updateTraining);
router.delete('/:id',isAuth, TrainingController.deleteTraining);
router.post('/:id/start-training', isAuth, TrainingController.startTraining);
router.post('/:id/end-training', isAuth, TrainingController.endTraining);
router.post('/addSession', isAuth, TrainingController.addSession);
router.get('/getSessions/:trainingId',isAuth, TrainingController.getSessions);
router.post('/addAnnouncement', isAuth, TrainingController.addAnnouncement);
router.get('/getAnnouncements/:trainingId',isAuth, TrainingController.getAnnouncements);
router.delete('/deleteAnnouncement/:announcementId',isAuth, TrainingController.deleteAnnouncement);
router.put('/editAnnouncement/:announcementId',isAuth, TrainingController.editAnnouncement);
router.post('/sendMessage/:trainingId', isAuth,upload.array('files'), TrainingController.sendMessage);
router.get('/getMessages/:trainingId',isAuth, TrainingController.getMessages);


module.exports = router;