const MentorRequest = require('../Models/RequestMentor');
const Mentor = require('../Models/user');

const createMentorRequest = async (req, res, next) => {
    try {
        const { author, track, languagePreference, genderPreference, type } = req.body;
        let mentorRequestData = {
            author:author,
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

        res.status(200).json({ message: 'Mentor request created successfully', recommendedMentors });
        next();
    } catch (error) {
        console.error('Error requesting mentor:', error);
        res.status(400).json({ message: 'Error requesting mentor' });
    }
};

const getRecommendedMentors = async (preferredLanguage, preferredGender, minSalary, maxSalary, interests, track , next) => {
    try {
        const mentors = await Mentor.find({
            languages: preferredLanguage,
            gender: preferredGender,
            minSalary: { $lte: maxSalary },
            maxSalary: { $gte: minSalary },
            interests: { $in: interests },
            track: track
        }).sort({ rating: -1 }).limit(10); 

        return mentors;
    } catch (error) {
        console.error('Error fetching recommended mentors:', error);
        throw new Error('Error fetching recommended mentors');
    }
};



module.exports = {
    createMentorRequest
};
