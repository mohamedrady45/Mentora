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
        if (menteeId == mentorId) {
            return res.status(400).json({ message: "You can't create a session with yourself." })
        }
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
//TODO: need to test
const confirmSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);

        //TODO:payment
        //update is confirmed
        session.isConfirmed = true;
        await session.save();
        //TODO:add to Schedule
        res.status(201).json({
            message: "Session created successfully", data: {
                session: session,
            }
        });


    } catch (err) {
        console.log("error in confirme session");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

//TODO: need to test

const addMatrial = async (req, res, next) => {
    try {
        const { description } = req.body;
        const sessionId = req.params.sessionId;
        const Attachments = req.files



        const session = await Session.findById(sessionId);
        session.matrial.text = description;
        Attachments.map(file => {
            session.matrial.Attachments.push({
                fileType: file.mimetype,
                filePath: file.path
            })
        });

        await session.save();

        res.status(201).json({
            message: "Matrial uploaded successfully"
        });


    } catch (err) {
        console.log("error in upload matrial");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getMentorSessions = async (req, res, next) => {
    try {
        const mentorId = req.userId;
        const sessions = await Session.find({ mentor: mentorId }).populate('mentor','firstName lastName').populate('mentees','firstName lastName');
        res.status(200).json({
            sessions
        });

    } catch (err) {
        console.log("error in find mentor sessions");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getMenteeSessions = async (req, res, next) => {
    try {
        const menteeId = req.userId;
        const sessions = await Session.find({ mentees: { $in: [menteeId] } }).populate('mentor', 'firstName email') // populate mentor with name and email fields
        .populate('mentees', 'firstName email');
        res.status(200).json({
            sessions
        });

    } catch (err) {
        console.log("error in find mentee sessions");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const getSession = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId;
        const session = await Session.findById(sessionId).populate('mentor', 'firstName email').populate('mentees', 'firstName email');
        res.status(200).json({
            session
        });
    } catch (err) {
        console.log("error in get sessioon");
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


module.exports = {
    createSession,
    confirmSession,
    addMatrial,
    getMentorSessions,
    getMenteeSessions,
    getSession
}