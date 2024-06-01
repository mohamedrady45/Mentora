const express = require('express');
const TaskController = require('../controllers/TaskController');
const isAuth = require('../middlewares/isAuth');
const router = express.Router();

//http://localhost:4000/api/task
router.get('/',isAuth, TaskController.getAllTasks);
router.get('/:id',isAuth, TaskController.getOneTask);
router.post('/add-task', isAuth, TaskController.AddTask);
router.put('/:id',isAuth, TaskController.updateTask);
router.delete('/:id',isAuth, TaskController.deleteTask);;

module.exports = router;