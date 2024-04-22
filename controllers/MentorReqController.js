const MentorRequest = require('../models/mentorRequest');

// Controller function to handle mentor requests
const createMentorRequest = async (req, res, tokenId) => {
    try {
        console.log('Token ID:', tokenId);

        const mentorRequest = new MentorRequest(req.body);

        if (mentorRequest.type === 'long-term') {
            // Handle long-term mentor request
            const { individualOrGroup } = req.body;
            mentorRequest.individualOrGroup = individualOrGroup;

            if (individualOrGroup === 'individual') {
                const { oneToOneOrGroupTraining } = req.body;
                mentorRequest.oneToOneOrGroupTraining = oneToOneOrGroupTraining;
            } else if (individualOrGroup === 'group') {
                const { groupSize } = req.body;
                mentorRequest.groupSize = groupSize;
            } else {
                throw new Error('Invalid individualOrGroup value');
            }

            const { duration, minSalary, maxSalary } = req.body;
            mentorRequest.duration = duration;
            mentorRequest.minSalary = minSalary;
            mentorRequest.maxSalary = maxSalary;
            // Validate if mentors are available within the specified salary range
            const mentorsAvailable = await Mentor.find({
                minSalary: { $lte: maxSalary }, 
                maxSalary: { $gte: minSalary }
            });
            if (mentorsAvailable.length === 0) {
                throw new Error('No mentors available in this salary range');
            }

        } else if (mentorRequest.type === 'one-time') {
            // Handle one-time mentor request
            const { date, timeAvailability, reason, minSalary, maxSalary } = req.body;
            mentorRequest.date = date;
            mentorRequest.timeAvailability = timeAvailability;
            mentorRequest.reason = reason;
            mentorRequest.minSalary = minSalary;
            mentorRequest.maxSalary = maxSalary;
            // Validate if mentors are available within the specified salary range
            const mentorsAvailable = await Mentor.find({
                minSalary: { $lte: maxSalary }, 
                maxSalary: { $gte: minSalary }
            });
            if (mentorsAvailable.length === 0) {
                throw new Error('No mentors available in this salary range');
            }

        } else {
            throw new Error('Invalid mentor request type');
        }

        // Save the mentor request to the database
        await mentorRequest.save();
        
        // Send a success response with the saved mentor request data
        res.status(201).json({message:'Request has been created successfully'});
    } catch (error) {
        // If there's an error, send a 400 (Bad Request) response with the error message
        res.status(400).json({message:'invalid request'});
    }
};

module.exports = {
    createMentorRequest
};
