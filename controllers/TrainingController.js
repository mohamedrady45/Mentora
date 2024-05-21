const Training = require('../Models/Training');
const Mentor = require('../Models/user')

//get all posts
const getAllTrainings = async (req, res) => {
    try {
      const trainigs = await Training.find();
      console.log(trainigs);
      res.status(200).json(trainigs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// create new training
const createTraining = async(req, res, next) => {
    try{
        const mentor = await Mentor.findById(req.userId);
        if(!mentor){
            return res.status(404).json({ error: 'User not found' });
        }
        const {name, description, track, requirements, Salary, duration, numberOfRequiredMentees} = req.body;

        const newTraining = new Training({
            name: name,
            description: description,
            track: track,
            requirements: requirements,
            Salary: Salary,
            duration: duration,
            numberOfRequiredMentees: numberOfRequiredMentees,

        });
        await newTraining.save();
        res.status(200).json({ message: 'You successfully created the training.' });
    }catch(err){
        console.error('Error creating training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//update training
const updateTraining = async(req, res, next) => {
    try{
        //find the id of the post to be updated
        const training = await Training.findById(req.params.id);
        await training.updateOne({$set:req.body});
        res.status(200).json({message:'You updated the training successfully'})
    }catch(err){
        console.error('Error updating training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    }
};

//delete trainig
const deleteTraining = async(req, res, next) =>{
    try{
        const trainig = await Training.findById(req.params.id);
        await trainig.deleteOne();
        res.status(200).json({message:'The training has been successfully deleted.'})
    }catch(err){
      console.error('Error deleting training.', err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  
    }
};

//


module.exports = {
    getAllTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
};