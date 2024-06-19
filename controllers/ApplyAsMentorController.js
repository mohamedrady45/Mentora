const Application = require("../Models/ApplyAsMentor");
const User = require('../Models/user');
const cloudinary = require('../services/cloudinary');

//Apply As Mentor
const ApplyAsMentor = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isMentor === true) {
            return res.status(409).json({ error: 'You are already a mentor' }); 
        }

        const { track, experience, YearOfExperience, LinkedinUrl, GithubUrl } = req.body;

        const newApplication = new Application({
            userId: userId, 
            track: track,
            experience: experience,
            YearOfExperience: YearOfExperience,
            LinkedinUrl: LinkedinUrl,
            GithubUrl: GithubUrl,
        });

        await newApplication.save();

        res.status(200).json({ message: 'Your application was submitted.' });
    } catch (err) {
        console.error('Error creating post.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


//get all applications
const getAllApplications = async (req, res) => {
    try {
      const applications = await Application.find();
      console.log(applications);
      res.status(200).json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    ApplyAsMentor,
    getAllApplications
}