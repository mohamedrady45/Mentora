const express = require('express');
const TaskController = require('../controllers/TaskController');
const isAuth = require('../middlewares/isAuth');
const uploadFile = require('../middlewares/uploadFile')
const router = express.Router();

//http://localhost:4000/api/task
router.get('/:trainingId',isAuth, TaskController.getAllTasks);
router.get('/:id',isAuth, TaskController.getOneTask);
router.post('/addTask/:trainingId', isAuth, uploadFile.single('task') ,TaskController.AddTask);
router.put('/:taskId',isAuth, TaskController.updateTask);
router.delete('/:taskId',isAuth, TaskController.deleteTask);
router.post('/tasks/:taskId/submit',isAuth,TaskController.SubmitTask);

module.exports = router;