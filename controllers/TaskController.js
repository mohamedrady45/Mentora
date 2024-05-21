const Task = require('../Models/Task');
const User = require('../Models/user');

//get all tasks
const getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find();
      console.log(tasks);
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

//get one task
const getOneTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if(!task){
        return res.status(404).json({ error: 'Task not found' });
      }
      console.log(task);
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

//mentor adds new task
const AddTask = async(req, res, next) => {
    try{
        const mentor = await User.findById(req.userId);
        if(!mentor){
            return res.status(404).json({ error: 'User not found' });
        }
        const {content, deadline} = req.body;
        const newTask = new Task({
            content: content,
            createdAt: Date.now,
            deadline: deadline,
        });
        await newTask.save();
        res.status(200).json({ message: 'You successfully added the task.' });
    }catch(err){
        console.error('Error creating task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

//update task
const updateTask = async(req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);
        await task.updateOne({$set:req.body});
        res.status(200).json({message:'You updated the task successfully'})
    }catch(err){
        console.error('Error updating task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    }
};

//delete task
const deleteTask = async(req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);
        await task.deleteOne();
        res.status(200).json({message:'The task has been successfully deleted.'})
    }catch(err){
      console.error('Error deleting the task.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//

module.exports = {
    getAllTasks,
    getOneTask,
    AddTask,
    updateTask,
    deleteTask,
};