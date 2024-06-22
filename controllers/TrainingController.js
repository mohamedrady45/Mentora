const Training = require('../Models/Training');
const Mentor = require('../Models/user');
const Session = require('../Models/Session');
const Test = require('../Models/Test');
const MassageModel = require('../Models/message')
const Announcement = require('../Models/Announcement');
const MaterialMaodle = require('../Models/Material');
const { findById } = require('../Models/Task');
const materialModel = require('../Models/Material');
const cloudinary = require("../services/cloudinary");


 const getUserAllTrainings = async (req, res) => {
    try {
        const userId = req.userId;
        const trainigs = await Training.find({ 'mentees.menteeId': userId }).select('_id name description track mentees.counter status TrainingPicture');
        console.log(trainigs);
        res.status(200).json({message: 'Get all trainings', data: {trainigs:{...trainigs, count: trainigs.length}}});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMentorTrainings = async (req, res, next) => {
    try {
        const userId = req.userId;
        const trainigs = await Training.find({ mentor: userId }).select('_id name description track numberOfRequiredMentees status TrainingPicture');
        console.log(trainigs);
        res.status(200).json({message: 'Get all trainings', data: {trainigs:{...trainigs, count: trainigs.length}}});
    } catch (err) {
        console.error('Error getting mentor trainings.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const getTrainingById = async (req, res, next) => {
    try {
        const trainingId = req.params.trainingId;
        const training = await Training.findById(trainingId).populate('mentor','firstName lastName').populate('mentees.menteeId','lastName firstName');
        res.status(200).json({message: 'Get training by id', data: {training}});
    } catch (err) {
        console.error('Error getting training by id.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// create new training
const createTraining = async (req, res, next) => {
    try {
        const mentorId = req.userId;

        const { name, description, track, level, requirements, Salary, duration, numberOfRequiredMentees, language } = req.body;
        const file =req.file;
        let attachment=null
        if(!name||!description||!track||!level||!requirements||!Salary||!duration){
            return res.status(400).json({message: 'Please fill all fields'})
        }

        if (file) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "Training",
            });

            attachment =  result.secure_url;
        }

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
            mentor: mentorId,
            TrainingPicture:attachment

        });
        await newTraining.save();
        res.status(200).json({ message: 'You successfully created the training.', data: { training: newTraining._id } });
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

//start training
const startTraining = async (req, res, next) => {
    try {
        const trainig = await Training.findById(req.params.id);

        if (!trainig) {
            return res.status(404).json({ error: 'Training not found' });
        }
        //update training status to active
        trainig.status = "active";
        await trainig.save();

        res.status(200).json({ message: 'You successfully starts the training.' });
    } catch (err) {
        console.error('Error starting the training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

//end training
const endTraining = async (req, res, next) => {
    try {
        
        const trainig = await Training.findById(req.params.id);
        if (!trainig) {
            return res.status(404).json({ error: 'Training not found' });
        }
        const { status } = req.body;
        if (status === "finished") {
            trainig.status = "finished";
            await trainig.save();
        }
        res.status(200).json({ message: 'You successfully end this training.' });
    } catch (err) {
        console.error('Error starting the training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

const addSession = async (req, res, next) => {
    try {
        const { title, description, date, trainingId } = req.body;
        const mentorId = req.userId;
        const trainig = await Training.findById(trainingId);
        const mentees = trainig.mentees;
        //TODO:add session to schedule to mentor and mentees
        const session = new Session({
            title: title,
            description: description,
            date: date,
            training: trainingId,
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
            message: 'Get all sessions',
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
        const { trainingId, title, description } = req.body;

        const announcement = await Announcement.create({ title, description, training: trainingId })

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

        const announcements = await Announcement.find({ training: trainingId });

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

        const announcement = await Announcement.findById(announcementId);


        await announcement.deleteOne();

        res.status(200).json({
            message: 'Announcement was deleted',
            data: {
                announcement
            }
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

        await Announcement.findByIdAndUpdate(announcementId, { title, description });

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

const sendMessage = async (req, res, next) => {
    try {
        const { trainingId } = req.params;
        const userId = req.userId;
        const { message } = req.body;
        const files = req.files;

        //save msg
        const Nfiles = files.map(file => {
            return {
                fileType: file.mimetype,
                filePath: file.path
            }
        });
        const Nmsg = new MassageModel({

            senderID: userId,
            message: message,
            files: Nfiles,
        })
        await Nmsg.save();

        const trainig = await Training.findById(trainingId);
        trainig.messages.push(Nmsg._id)
        await trainig.save();

        res.status(200).json({
            message: 'Message was sent',

        })

    } catch (err) {
        console.log("error in send message");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getMessages = async (req, res, next) => {
    try {
        const { trainingId } = req.params;
        const trainig = await Training.findById(trainingId).populate({
            path: 'messages',
            populate: {
                path: 'senderID',
                select: 'firstName lastName'
            }
        });

        res.status(200).json({
            message: 'get training messages',
            data: {
                messages: trainig.messages
            }
        })

    } catch (err) {
        console.log("error in get message");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
//TODO: test this function
const uploadMaterial = async (req, res, next) => {
    try {
        const {trainigId} = req.params;
        const { description } = req.body;
        let files = req.files

        const trainig = await Training.findById(trainigId);

        //upload files in cloud
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "Material",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            }));
        }
        //create new Material
        const newMaterial =new materialModel({
            text:description,
            attachmentsUrl:attachments,
        });
        await newMaterial.save();

        //add material to training
        trainig.material.push(newMaterial);
        await trainig.save();

        res.status(201).json({
            message: "Matrial uploaded successfully"
        });

    } catch (err) {
        console.log("error in upload new material");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
const editMaterial = async (req, res, next) => {
    try {
        const { materialId } = req.params;
        const { description } = req.body;
        let files = req.files;
        let attachments = [];

        const material = await materialModel.findById(materialId);

        if (!material) {
            const error = new Error('Material not found');
            error.statusCode = 404;
            throw error;
        }

        // Handle file uploads if there are new files
        if (files && files.length > 0) {
            const uploadPromises = files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "Material",
                });
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map(result => ({
                type: result.resource_type === 'image' ? 'image' : result.resource_type === 'video' ? 'video' : 'file',
                url: result.secure_url,
                public_id: result.public_id
            }));

            // Delete old attachments from cloudinary
            if (material.attachmentsUrl && material.attachmentsUrl.length > 0) {
                const deletePromises = material.attachmentsUrl.map(att => {
                    return cloudinary.uploader.destroy(att.public_id);
                });
                await Promise.all(deletePromises);
            }

            material.attachmentsUrl = attachments;
        }

        // Update description if provided
        if (description) {
            material.text = description;
        }

        await material.save();

        res.status(200).json({
            message: "Material updated successfully",
            material
        });

    } catch (err) {
        console.log("error in edit material");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const deleteMaterial = async (req, res, next) => {
    try {
        const { materialId } = req.params;

        const material = await materialModel.findById(materialId);

        if (!material) {
            const error = new Error('Material not found');
            error.statusCode = 404;
            throw error;
        }

        // Delete attachments from cloudinary
        if (material.attachmentsUrl && material.attachmentsUrl.length > 0) {
            const deletePromises = material.attachmentsUrl.map(att => {
                return cloudinary.uploader.destroy(att.public_id);
            });
            await Promise.all(deletePromises);
        }

        // Remove material from training
        await Training.updateMany(
            { material: materialId },
            { $pull: { material: materialId } }
        );

        // Delete the material
        await materialModel.findByIdAndRemove(materialId);

        res.status(200).json({
            message: "Material deleted successfully"
        });

    } catch (err) {
        console.log("error in deleting material");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const getAllMaterials = async (req, res, next) => {
    try {
        const { trainingId } = req.params;

        const training = await Training.findById(trainingId).populate('material');

        if (!training) {
            const error = new Error('Training not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: "Materials fetched successfully",
            materials: training.material
        });

    } catch (err) {
        console.log("error in fetching materials");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};







//Enroll mentee in a training
const enrollInTraining = async (req, res, next) => {
    try {
        const userId = req.userId;
        const trainigId = req.params.trainingId;
        const trainig = await Training.findById(trainigId);
        if (!trainig) {
            return res.status(404).json({ error: 'Training not found' });
        }
        if(trainig.hasTest===true){
            const test = await Test.findById(trainig.test);
            if(!test.passed.includes(userId)){
                return res.status(400).json({ error: 'You are not passed the test' });
            }
        }
        //if user is already enrolled
        if (trainig.mentees.menteeId.includes(userId)) {
            return res.status(400).json({ error: 'You are already enrolled in this training' });
        }
        trainig.mentees.menteeId.push(userId);
        trainig.mentees.counter++;
        await trainig.save();
        res.status(200).json({ message: 'Successfully enrolled in training.' })
    } catch (err) {
        console.error('Error enrolling in training.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


module.exports = {
    getUserAllTrainings,
    getMentorTrainings,
    getTrainingById,
    enrollInTraining,
    createTraining,
    updateTraining,
    deleteTraining,

    startTraining,
    endTraining,
  
    addSession,
    getSessions,
    addAnnouncement,
    getAnnouncements,
    deleteAnnouncement,
    editAnnouncement,
    sendMessage,
    getMessages,
    uploadMaterial,
    editMaterial,
    deleteMaterial,
    getAllMaterials,
};