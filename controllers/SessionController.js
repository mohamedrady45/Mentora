const Request = require('../Models/RequestMentor')
const Session = require('../Models/Session')
const User = require('../Models/user')
const Schedule = require('../Models/Schedule'); 
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

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

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        session.confirmed = true;
        await session.save();

        const meetingLinkResponse = await createGoogleMeet(session.title, session.date);
        const meetingLink = meetingLinkResponse.link;
        session.meetingLink = meetingLink;
        await session.save();

        const userSchedule = new Schedule({
            user: session.mentees[0],
            title: session.title,
            type: session.type,
            createdBy: session.mentor,
            from: session._id,
            date: session.date,
            meetingLink: meetingLink
        });
        await userSchedule.save();

        const mentorSchedule = new Schedule({
            user: session.mentor,
            title: session.title,
            type: session.type,
            createdBy: session.mentor,
            from: session._id,
            date: session.date,
            meetingLink: meetingLink
        });
        await mentorSchedule.save();

        res.status(201).json({
            message: 'Session confirmed and added to schedules successfully',
            data: {
                meetingLink: meetingLink 
            }
        });
    } catch (err) {
        console.error('Error confirming session:', err);
        res.status(err.statusCode || 500).json({ message: err.message || 'An error occurred' });  
    }
};

const createGoogleMeet = async (title, startDate) => {
    try {
        const calendar = google.calendar('v3');
        const eventStartTime = new Date(startDate);
        const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000);

        const event = {
            summary: title,
            start: {
                dateTime: eventStartTime.toISOString(),
                timeZone: 'UTC',
            },
            end: {
                dateTime: eventEndTime.toISOString(),
                timeZone: 'UTC',
            },
            
        };

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
            key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const response = await calendar.events.insert({
            auth,
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            resource: event,
            conferenceDataVersion: 1,
        });

        console.log('Event created with Google Meet link:', response.data);

        return {
            link: "https://meet.google.com/okp-rfdc-azq?authuser=1",
            eventData: response.data,
        };
    } catch (err) {
        console.error('Error creating event:', err.response ? err.response.data : err.message);
        throw new Error('Failed to create event');
    }
};


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
        const sessions = await Session.find({
            mentor: mentorId,
            training: { $exists: false }
        })
            .populate('mentor', 'firstName lastName')
            .populate('mentees', 'firstName lastName');

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
        const sessions = await Session.find({
            mentees: { $in: [menteeId] },
            training: { $exists: false }
        })
            .populate('mentor', 'firstName email') // populate mentor with name and email fields
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