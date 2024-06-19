const MentorRequest = require('../Models/RequestMentor');
const Mentor = require('../Models/user');
const Training = require('../Models/Training');
const User = require('../Models/user');

const createMentorRequest = async (req, res, next) => {
    try {
        const { track, languagePreference, genderPreference, type, description, minSalary, maxSalary, sessionDate, startTime, endTime } = req.body;
        const userId = req.userId;
        let mentorRequestData = {
            userId,
            track,
            languagePreference,
            genderPreference,
            type,
            description,
            sessionDate,
            startTime,
            endTime
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

const getMentorsRecommendation = async (req, res, next) => {
    try {
        const { preferredLanguage, preferredGender, maxSalary, minSalary, track } = req.body;

        // Create a filter object
        const filter = {
            isMentor: true,  // Ensure only mentors are considered
        };

        // Add gender filter if provided
        if (preferredGender) {
            filter.gender = preferredGender;
        }

        // Add salary range filter if provided
        if (minSalary !== undefined && maxSalary !== undefined) {
            filter['mentorshipInfo.minSalary'] = { $lte: maxSalary };
            filter['mentorshipInfo.maxSalary'] = { $gte: minSalary };
        }

        // Add track filter if provided
        if (track) {
            filter['mentorshipInfo.track'] = track;
        }

        // Add language filter if provided
        if (preferredLanguage) {
            filter.$or = [
                { languages: { $in: [preferredLanguage] } },
                { languages: { $exists: false } },
                { languages: { $size: 0 } }
            ];
        }

        const mentors = await User.find(filter)
            .select('_id firstName lastName profilePicture')
            .sort({ rating: -1 })
            .limit(10);

        if (mentors.length === 0) {
            return res.status(400).json({ message: 'No mentors match your request' });
        }

        res.status(200).json({ message: 'Mentors match your request', mentors });
    } catch (error) {
        console.error('Error fetching recommended mentors:', error);
        res.status(500).json({ message: 'Error fetching recommended mentors' });
    }
};



const getTrainingsRecommendation = async (req, res, next) => {
    try {

        const trainigs = await Training.find({
            track: track,
            language: preferredLanguage,
        }).select('_id name track Salary')
            .sort({ rating: -1 }).limit(10);

        if (trainigs.length === 0) {
            return res.status(400).json({ message: 'No trainings match your request' });
        }
        res.status(400).json({ message: 'Trainings matches your request', trainigs });
    } catch (error) {
        console.error('Error fetching recommended mentors.', error);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
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

//Mentor accepts the request
const MentorAcceptedRequest = async(req, res, next) =>{
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
        //mentor accepts the request
        if(status === "accepted"){
            request.status = "accepted";
        } 
        await mentor.save();
        await request.save();
        res.status(200).json({ message: 'You accepted the request.' });       
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
    getTrainingsRecommendation,
    MentorRejectRequest,
    MentorAcceptedRequest,
};
