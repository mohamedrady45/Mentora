const MentorRequest = require('../Models/RequestMentor');
const Mentor = require('../Models/user');

const createMentorRequest = async (req, res, next) => {
    try {
        const { track, languagePreference, genderPreference, type, description,minSalary,maxSalary } = req.body;
        const userId = req.userId;
        let mentorRequestData = {
            userId,
            track,
            languagePreference,
            genderPreference,
            type,
            description
        };

        if (type === 'one-time') {
            const { Reason } = req.body;
            mentorRequestData = { ...mentorRequestData, Reason };
        } else if (type === 'long-term') {
            const { duration } = req.body;
            mentorRequestData = { ...mentorRequestData, duration };

        } else {
            return res.status(400).json({ message: 'Invalid mentorship type' });
        }

        const mentorRequest = new MentorRequest({
            ...mentorRequestData,
            minSalary,
            maxSalary
        });
        await mentorRequest.save();


        res.status(201).json({
            message: 'Mentor request created successfully',
            data: {
                RequestId: mentorRequest._id,
            }
        });

    } catch (error) {
        console.error('Error requesting mentor:', error);
        res.status(400).json({ message: 'Error requesting mentor' });
    }
};

//get mentors recommendation
const getMentorsRecommendation = async(req, res, next) =>{
    try {
        const mentors = await Mentor.find({
            languages: preferredLanguage,
            gender: preferredGender,
            minSalary: { $lte: maxSalary },
            maxSalary: { $gte: minSalary },
            track: track
        }).select('_id firstName lastName profilePicture')
          .sort({ rating: -1 }).limit(10); 

        if (mentors.length === 0) {
            return res.status(400).json({ message: 'No mentors match your request'});
        }
        res.status(400).json({ message: 'Mentors matches your request', mentors});
    } catch (error) {
        console.error('Error fetching recommended mentors:', error);
        throw new Error('Error fetching recommended mentors');
    }
};

// send the request to the mentor
const RequestRecommendedMentor = async(req, res, next) =>{
    try{
       
        const mentor = await Mentor.findById(req.userId);
        if(!mentor){
            return res.status(404).json({ message: 'There is no mentor selected' });   
        }
        const request = await MentorRequest.findById(req.params.id);
        if(!request){
            return res.status(404).json({ message: 'There is no request' });
        }
        mentor.requests.push(req.params.id);
        await mentor.save();

        res.status(200).json({ message: 'You requested the mentor.' });

    }catch(err){
        console.error('Error finding the mentor.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

//Mentor rejects the request
const MentorRejectRequest = async(req, res, next) =>{
    try{
        const mentor = await Mentor.findById(req.userId);
        if (!mentor) {
            return res.status(404).json({ error: 'User not found' });
        }
        const {status} = req.body;
        const request = await MentorRequest.findById(req.params.id);
        if(!request){
            return res.status(404).json({ message: 'There is no request' });
        }
        if (!Array.isArray(mentor.requests)) {
            mentor.requests = [];
        }

        //mentor rejects the request
        if(status === "rejected"){
            mentor.requests = mentor.requests.filter((requestId) => requestId.toString() != req.params.id);
            request.status = "rejected";
        } 
        await mentor.save();
        await request.save();
        res.status(200).json({ message: 'You rejected the request.' });       
    } catch(err){
        console.error('Error rejecting the request.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


module.exports = {
    createMentorRequest,
    getMentorsRecommendation,
    RequestRecommendedMentor,
    MentorRejectRequest
};
