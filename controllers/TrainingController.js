const Training = require('../Models/Training');
const Mentor = require('../Models/user');
const Announcement =require('../Models/Announcement')

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
const createTraining = async (req, res, next) => {
    try {
        const mentor = await Mentor.findById(req.userId);
        if (!mentor) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { name, description, track, requirements, Salary, duration, numberOfRequiredMentees } = req.body;

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
    } catch (err) {
        console.error('Error creating training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//update training
const updateTraining = async (req, res, next) => {
    try {
        //find the id of the post to be updated
        const training = await Training.findById(req.params.id);
        await training.updateOne({ $set: req.body });
        res.status(200).json({ message: 'You updated the training successfully' })
    } catch (err) {
        console.error('Error updating training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//delete trainig
const deleteTraining = async (req, res, next) => {
    try {
        const trainig = await Training.findById(req.params.id);
        await trainig.deleteOne();
        res.status(200).json({ message: 'The training has been successfully deleted.' })
    } catch (err) {
        console.error('Error deleting training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//TODO:TESTME
const addSession = async (req, res, next) => {
    try {
        const { title, description, time, trainingId } = req.body;
        const mentorId = req.userId;
        const mentees = await Training.findById(trainingId).mentees.menteeId;
        const session = new Session({
            title: title,
            description: description,
            time: time,
            trainingId: trainingId,
            mentor: mentorId,
            mentees: mentees
        });
        await session.save();
        res.status(200).json({ message: 'The session has been successfully added.' })
    } catch (err) {
        console.log("craete session");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


const getSessions = async (req, res, next) => {
    try {
        const { trainingId } = req.params;

        const sessions = await Session.find({ training: trainingId });

        res.status(200).json({
            message: 'The session has been successfully added.',
            data: {
                sessions: sessions
            }
        })

    } catch (err) {
        console.log("error in get sessions");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const addAnnouncement = async (req, res, next) => {
    try {
        const { trainingId  , title,description } = req.body;

        const announcement =await Announcement.create({title,description,training:trainingId})

        res.status(200).json({
            message: 'add new announcement',
            data: {
                announcement
            }
        })

    } catch (err) {
        console.log("error in add new announcement");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getAnnouncements = async (req, res, next) => {
    try {
        const { trainingId } = req.params;

        const announcements = await Training.find({trainig:trainingId});

        res.status(200).json({
            message: 'get all training announcement',
            data: {
                announcements
            }
        })

    } catch (err) {
        console.log("error in get all training announcement");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const deleteAnnouncement = async (req, res, next) => {
    try {
        const { announcementId } = req.params;

        const announcements = await Training.findByIdAndDelete(announcementId);

        res.status(200).json({
            message: 'Announcement was deleted',
            
        })

    } catch (err) {
        console.log("error in delete announcement");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
const editAnnouncement = async (req, res, next) => {
    try {
        const { announcementId } = req.params;
        const { title, description } = req.body;

         await Training.findByIdAndUpdate(announcementId,{title,description});

        res.status(200).json({
            message: 'Announcement was edited',
            
        })

    } catch (err) {
        console.log("error in edit announcement");
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

    addSession,
    getSessions,
    addAnnouncement,
    getAnnouncements,
    deleteAnnouncement,
    editAnnouncement
};