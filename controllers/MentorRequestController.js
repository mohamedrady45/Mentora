const MentorRequest = require('../Models/RequestMentor');
const Mentor = require('../Models/user');

const createMentorRequest = async (req, res, next) => {
    try {
        const { track, languagePreference, genderPreference, type, description } = req.body;
        const userId = req.body;
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



const getRecommendedMentors = async (preferredLanguage, preferredGender, minSalary, maxSalary, interests, track, next) => {
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
