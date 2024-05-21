const Training = require('../Models/Training');
const Mentor = require('../Models/user')

//get all trainings
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
        const {name, description, track, level, requirements, Salary, duration, numberOfRequiredMentees, language} = req.body;

        const newTraining = new Training({
            name: name,
            description: description,
            track: track,
            level: level,
            requirements: requirements,
            Salary: Salary,
            duration: duration,
            numberOfRequiredMentees: numberOfRequiredMentees,
            language: language,

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
const deleteTraining = async(req, res, next) => {
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

//start training
const startTraining = async(req, res, next) => {
    try{
        const mentor = await Mentor.findById(req.userId);
        if(!mentor){
            return res.status(404).json({ error: 'User not found' });
        }
        const trainig = await Training.findById(req.params.id);
        if(!trainig){
            return res.status(404).json({ error: 'Training not found' });
        }
        const {status} = req.body;
        if(status === "active")
        {
            trainig.status = "active";
            await trainig.save();
        }
        res.status(200).json({ message: 'You successfully starts the training.' });
    }catch(err){
        console.error('Error starting the training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    };
};

//end training
const endTraining = async(req, res, next) => {
    try{
        const mentor = await Mentor.findById(req.userId);
        if(!mentor){
            return res.status(404).json({ error: 'User not found' });
        }
        const trainig = await Training.findById(req.params.id);
        if(!trainig){
            return res.status(404).json({ error: 'Training not found' });
        }
        const {status} = req.body;
        if(status === "finished")
        {
            trainig.status = "finished";
            await trainig.save();
        }
        res.status(200).json({ message: 'You successfully starts the training.' });
    }catch(err){
        console.error('Error starting the training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    };
};

//get trainings recommendation
const getTrainingsRecommendation = async(req, res, next) =>{
    try {

        const trainigs = await Training.find({
            track: track,
            language: preferredLanguage,
        }).select('_id name track Salary')
          .sort({ rating: -1 }).limit(10); 

        if (trainigs.length === 0) {
            return res.status(400).json({ message: 'No trainings match your request'});
        }
        res.status(400).json({ message: 'Trainings matches your request', trainigs});
    } catch (error) {
        console.error('Error fetching recommended mentors:', error);
        throw new Error('Error fetching recommended mentors');
    }
};





//Enroll mentee in a training
const enrollInTraining = async(req, res, next) => {
    try{

        res.status(200).json({message:'Successfully enrolled in training.'})
    }catch(err){
        console.error('Error enrolling in training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  
    }
}


module.exports = {
    getAllTrainings,
    createTraining,
    updateTraining,
    deleteTraining,

    startTraining,
    endTraining,
    getTrainingsRecommendation,
    //enrollInTraining
};