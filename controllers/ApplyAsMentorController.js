const Application = require("../Models/ApplyAsMentor");
const User = require('../Models/user');
//Apply As Mentor
const ApplyAsMentor = async(req, res, next) => {
    try{
        const user = User.findById(req.body.author);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { track, experience, YearOfExperience, LinkedinUrl, GithubUrl} = req.body;
        const CV = req.file.path;
        const newApplication = new Application({
            track: track,
            experience: experience,
            YearOfExperience: YearOfExperience,
            LinkedinUrl: LinkedinUrl,
            GithubUrl: GithubUrl,
            CV: CV,
        });
        
        await newApplication.save();
        res.status(200).json({ message: 'Your application was shared.' });
    } catch(err){
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