const Request = require('../Models/RequestMentor')
const Session = require('../Models/Session')

const createSession = async (req, res, next) => {
    try {
        const { title, description, date, price } = req.body;
        const reqId = req.params.reqId;
        const request = await Request.findById(reqId);
        const menteeId = request.userId;
        const mentorId = req.userId;

        const session = new Session({ title, description, date, mentor: mentorId, price });
        session.mentees.push(menteeId);
        await session.save();

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