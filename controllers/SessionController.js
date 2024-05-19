const Request = require('../Models/RequestMentor')
const Session = require('../Models/Session')
const User = require('../Models/user')

const createSession = async (req, res, next) => {
    try {
        const { title, description, date, price } = req.body;
        const reqId = req.params.reqId;
        const request = await Request.findById(reqId);
        const menteeId = request.userId;
        const mentorId = req.userId;
        const mentee = await User.findById(menteeId);
        const mentor = await User.findById(mentorId);

        const session = new Session({ title, description, date, mentor: mentorId, price });
        session.mentees.push(menteeId);
        await session.save();

        mentee.sessions.ids.push(session._id);
        await mentee.save();

        mentor.sessions.ids.push(session._id);
        await mentor.save();

        res.status(201).json({
            message: "Session created successfully", data: {
                session: session,
            }
        });


    } catch (err) {
        console.log("craete session");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



module.exports = {
    createSession,
}