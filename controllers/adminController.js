const userService = require('../services/user');
const ApplyAsMentor = require('../Models/ApplyAsMentor')
const User = require('../Models/user');

const promoteToAdmin = async (req, res, next) => {
    try {
        const user = await userService.findUser(req.params.id);
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }
        if (user.role === 'Admin') {
            return res.status(400).send({ message: 'User is already an admin' });
        }
        user.role = 'Admin';
        await user.save();
        res.status(200).send(user);
      } catch (error) {
        res.status(500).send({ message: error.message });
        next(error);
      }
}
const getAllApplications = async (req, res, next) => {
    try {
        const allApplications = await ApplyAsMentor.find();
        res.status(200).send(allApplications);
    } catch (error) {
        res.status(500).send({ message: error.message });
        next(error);
    }
};

const getRequestById = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const request = await ApplyAsMentor.findById(requestId);

        if (!request) {
            return res.status(404).send({ message: 'Request not found' });
        }

        res.status(200).send(request);
    } catch (error) {
        res.status(500).send({ message: error.message });
        next(error);
    }
};

const acceptRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const request = await ApplyAsMentor.findById(requestId);

        if (!request) {
            return res.status(404).send({ message: 'Request not found' });
        }

        const userId = request.userId;

        request.status = 'accepted';
        await request.save();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    isMentor: true,
                    mentorshipInfo: {
                        track: request.track,
                        experience: request.experience,
                        LinkedinUrl: request.LinkedinUrl,
                        GithubUrl: request.GithubUrl,
                    }
                }
            },
            { new: true }
        );

        await updatedUser.save();
        await ApplyAsMentor.findByIdAndDelete(requestId);

        res.status(200).send({ message: 'Request accepted, user updated, and request deleted' });
    } catch (error) {
        res.status(500).send({ message: error.message });
        next(error);
    }
};


const rejectRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const request = await ApplyAsMentor.findByIdAndDelete(requestId);

        if (!request) {
            return res.status(404).send({ message: 'Request not found' });
        }

        res.status(200).send({ message: 'Request rejected and deleted' });
    } catch (error) {
        res.status(500).send({ message: error.message });
        next(error);
    }
};

module.exports = {
    promoteToAdmin,
    getAllApplications , 
    acceptRequest,
    rejectRequest,
    getRequestById
};