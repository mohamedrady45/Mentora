const express = require('express');
const TrainingController = require('../controllers/TrainingController');
const isAuth = require('../middlewares/isAuth');
const isMentor = require('../middlewares/isMentor')
const upload=require('../middlewares/uploadFile')
const router = express.Router();

//http://localhost:4000/api/training

router.get('/',isAuth, TrainingController.getUserAllTrainings);
router.get('/mentor',isAuth,TrainingController.getMentorTrainings);//only mentor
router.get('/:trainingId',isAuth, TrainingController.getTrainingById);

router.put('/enroll/:trainingId',isAuth, TrainingController.enrollInTraining);
router.post('/create-training', isAuth,upload.single('image'),TrainingController.createTraining);//only mentor
router.put('/:id',isAuth, TrainingController.updateTraining);//only mentor
router.delete('/:id',isAuth, TrainingController.deleteTraining);//only mentor

router.put('/:id/startTraining', isAuth, TrainingController.startTraining);//only mentor
router.put('/:id/endTraining', isAuth, TrainingController.endTraining);//only mentor

router.post('/addSession', isAuth,TrainingController.addSession);//only mentor
router.get('/getSessions/:trainingId',isAuth, TrainingController.getSessions);

router.post('/addAnnouncement', isAuth, TrainingController.addAnnouncement);//only mentor
router.get('/getAnnouncements/:trainingId',isAuth, TrainingController.getAnnouncements);
router.delete('/deleteAnnouncement/:announcementId',isAuth, TrainingController.deleteAnnouncement);//only mentor
router.put('/editAnnouncement/:announcementId',isAuth, TrainingController.editAnnouncement);//only mentor

router.post('/sendMessage/:trainingId', isAuth,upload.array('files'), TrainingController.sendMessage);
router.get('/getMessages/:trainingId',isAuth, TrainingController.getMessages);
router.delete('/deleteMessage/:messageId/:trainingId', isAuth, TrainingController.deleteMessage );

//material
router.post('/:trainigId/uploadMaterial',isAuth,upload.array('files'),TrainingController.uploadMaterial)//only mentor
router.put('/editMaterial/:materialId',isAuth,upload.array('files'),TrainingController.editMaterial);//only mentor
router.delete('/deleteMaterial/:materialId', isAuth,TrainingController.deleteMaterial);//only mentor
router.get('/allTrainingMateria/:trainingId', TrainingController.getAllMaterials);




module.exports = router;