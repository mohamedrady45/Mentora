const express = require('express');
const TaskController = require('../controllers/TaskController');
const isAuth = require('../middlewares/isAuth');
const uploadFile = require('../middlewares/uploadFile')
const router = express.Router();

//http://localhost:4000/api/task
router.get('/:trainingId',isAuth, TaskController.getAllTasks);

router.get('/:taskId/oneTask',isAuth, TaskController.getOneTask);

router.post('/addTask/:trainingId', isAuth, uploadFile.single('task') ,TaskController.AddTask);//only Mentor

router.put('/:taskId/editTask',isAuth, uploadFile.single('task'),TaskController.updateTask);//only Mentor

router.delete('/:taskId/deleteTask',isAuth, TaskController.deleteTask);//only Mentor

router.post('/:taskId/submit',isAuth,uploadFile.single('submit'),TaskController.SubmitTask);

router.get('/:taskId/userSubmission',isAuth,TaskController.getAllUserSubmission);

router.get('/:taskId/taskSubmissions',isAuth,TaskController.getTaskSubmission);//only Mentor



module.exports = router;