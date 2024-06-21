const Task = require('../Models/Task');
const Submission = require('../Models/taskSubission');
const User = require('../Models/user');
const cloudinary = require("../services/cloudinary");


//get all tasks
const getAllTasks = async (req, res) => {
    try {
        const { trainingId } = req.params
        const tasks = await Task.find({ training: trainingId });;
        res.status(200).json({ message: "fetch all tasks", tasks: tasks })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//get one task
const getOneTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: "fetch one task", task: task });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//mentor adds new task
const AddTask = async (req, res, next) => {
    try {
        const { trainingId } = req.params;
        const mentorId = req.userId;
        const { description, deadline } = req.body;
        const file = req.file;

        const mentor = await User.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ error: 'User not found' });
        }

        let attachment = null;
        if (file) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "Task",
            });

            attachment = {
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        const newTask = new Task({
            training: trainingId,
            description: description,
            deadline: deadline,
            attachment: attachment,
        });
        await newTask.save();
        //TODO: add notification

        res.status(200).json({ message: 'You successfully added the task.' });
    } catch (err) {
        console.error('Error creating task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const updateTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { description, deadline } = req.body;
        const file = req.file;

        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update the description and deadline if provided
        if (description) task.description = description;
        if (deadline) task.deadline = deadline;

        // Handle file upload if a new file is provided
        if (file) {
            // Delete the old file from Cloudinary if it exists
            if (task.attachment && task.attachment.public_id) {
                await cloudinary.uploader.destroy(task.attachment.public_id);
            }

            // Upload new file to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "Task",
            });

            // Set the new attachment details
            task.attachment = {
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            };
        }
        console.log(task)
        // Save the updated task
        await task.save();

        res.status(200).json({ message: 'Task successfully updated.' });
    } catch (err) {
        console.error('Error updating task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//delete task
const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Delete the associated file from Cloudinary if it exists
        if (task.attachment && task.attachment.public_id) {
            await cloudinary.uploader.destroy(task.attachment.public_id);
        }

        // Delete the task from the database
        await task.deleteOne();

        res.status(200).json({ message: 'Task successfully deleted.' });
    } catch (err) {
        console.error('Error deleting task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const SubmitTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const menteeId = req.userId;
        const file = req.file;

        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        let attachment = null;
        if (file) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "Task",
            });

            attachment = {
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            };
        }
        // Create a new submission object
        const newSubmission = new Submission({
            task,
            mentee: menteeId,
            file: attachment
        });
        await newSubmission.save();

        // Add the new submission to the task's submissions array
        task.submissions.push(newSubmission);

        // Save the updated task
        await task.save();

        res.status(200).json({ message: 'Task successfully submitted.' });
    } catch (err) {
        console.error('Error submitting task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const getTaskSubmission = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate('submissions');
        res.status(200).json({ message: 'Get all task submission', task });
    } catch (err) {
        console.error('Error get your submission', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const getAllUserSubmission = async (req, res, next) => {
    try {
        const menteeId = req.userId;
        const { taskId } = req.params;
        const submissions = await Submission.find({ mentee: menteeId, task: taskId });
        
        res.status(200).json({ message: 'Get all your submission', submissions });
    } catch (err) {
        console.error('Error get your submission', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const reviewTask = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { review } = req.body;
        const submission = await Submission.findById(submissionId);
        submission.review = review;
        await submission.save();

        res.status(200).json({ message: 'review add successfully' });
    } catch (err) {
        console.error('Error submitting task.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};




module.exports = {
    getAllTasks,
    getOneTask,
    AddTask,
    updateTask,
    deleteTask,
    SubmitTask,
    getAllUserSubmission,
    getTaskSubmission,
    reviewTask,

};