const MentorRequest = require('../Models/RequestMentor');
const Mentor = require('../Models/user');

const createMentorRequest = async (req, res, next) => {
    try {
        const { track, languagePreference, genderPreference, type } = req.body;
        let mentorRequestData = {
            track,
            languagePreference,
            genderPreference,
            type,
        };

        if (type === 'one-time') {
            const { date, Reason } = req.body;
            mentorRequestData = { ...mentorRequestData, date, Reason };
        } else if (type === 'long-term') {
            const { duration, individualOrGroup, oneToOneOrGroupTraining, groupSize } = req.body;
            mentorRequestData = { ...mentorRequestData, duration, individualOrGroup, oneToOneOrGroupTraining };
            if (individualOrGroup === 'group') {
                mentorRequestData.groupSize = groupSize;
            }
        } else {
            return res.status(400).json({ message: 'Invalid mentorship type' });
        }

        const mentorRequest = new MentorRequest(mentorRequestData);
        await mentorRequest.save();

        
        const recommendedMentors = await getRecommendedMentors(languagePreference, genderPreference, mentorRequest.minSalary, mentorRequest.maxSalary, mentorRequest.interests , track);

        res.status(200).json({ message: 'Mentor request created successfully', reqestId:mentorRequest._id });
        next();
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
        const request = await Request.findById(req.params.id);
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
        const mentor = Mentor.findById(req.userId);
        if (!mentor) {
            return res.status(404).json({ error: 'User not found' });
        }

        const {status} = req.body;

        const request = await Request.findById(req.params.id);
        if(!request){
            return res.status(404).json({ message: 'There is no request' });
        }
        console.log(request);
        //mentor rejects the request
        if(status === "rejected"){
            mentor.requests = mentor.requests.filter((requestId) => requestId !== req.params.id);
            request.status = 'rejected';
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
