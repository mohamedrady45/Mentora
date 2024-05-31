const express = require('express');
const TrainingController = require('../controllers/TrainingController');
const isAuth = require('../middlewares/isAuth');
const isMentor = require('../middlewares/isMentor')
const upload=require('../middlewares/uploadFile')
const router = express.Router();

//http://localhost:4000/api/training

router.get('/',isAuth, TrainingController.getUserAllTrainings);
router.get('/:trainingId',isAuth, TrainingController.getTrainingById);
router.get('/mentor',isAuth,isMentor,TrainingController.getMentorTrainings);//only mentor

router.put('/enroll/:trainingId',isAuth, TrainingController.enrollInTraining);
router.post('/create-training', isAuth,isMentor, TrainingController.createTraining);//only mentor
router.put('/:id',isAuth,isMentor, TrainingController.updateTraining);//only mentor
router.delete('/:id',isAuth,isMentor, TrainingController.deleteTraining);//only mentor

router.put('/:id/startTraining', isAuth,isMentor, TrainingController.startTraining);//only mentor
router.put('/:id/endTraining', isAuth,isMentor, TrainingController.endTraining);//only mentor

router.post('/addSession', isAuth,isMentor,TrainingController.addSession);//only mentor
router.get('/getSessions/:trainingId',isAuth, TrainingController.getSessions);

router.post('/addAnnouncement', isAuth,isMentor, TrainingController.addAnnouncement);//only mentor
router.get('/getAnnouncements/:trainingId',isAuth, TrainingController.getAnnouncements);
router.delete('/deleteAnnouncement/:announcementId',isMentor,isAuth, TrainingController.deleteAnnouncement);//only mentor
router.put('/editAnnouncement/:announcementId',isAuth,isMentor, TrainingController.editAnnouncement);//only mentor

router.post('/sendMessage/:trainingId', isAuth,upload.array('files'), TrainingController.sendMessage);
router.get('/getMessages/:trainingId',isAuth, TrainingController.getMessages);


module.exports = router;