const Mentor = require('../Models/user');
const Request = require('../Models/RequestMentor');
const Training = require('../Models/Training');

//Search using user's name
const Search = async(req, res, next) => {
    try{
        const user = Mentor.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let {firstName, lastName} = req.body;

        // search with insensitive case
        firstName = new RegExp(firstName, 'i');
        lastName = new RegExp(lastName, 'i');

        const mentors = await Mentor.find({
            firstName: firstName,
            lastName: lastName
        });

        if (mentors.length === 0) {
            return res.status(404).json({ message: 'No user found with the provided name' });
        }
        res.status(200).json({ success: true, data: mentors });
    } catch(err){
        console.error('Error finding the user.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// send the request to the mentor
const RequestRecommendedMentor = async(req, res, next) =>{
    try{
       
        const mentor = await Mentor.findById(req.body.mentor);
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
}

//Mentor accepts or rejects the request
const MentorAcOrRejRequest = async(req, res, next) =>{
    try{
        const mentor = Mentor.findById(req.body.mentor);
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
            await mentor.save();
            await request.save();
            res.status(200).json({ message: 'You rejected the request.' });
        } else if (status === "accepted"){
            //mentor accepts the request
            request.status = 'accepted'; //create session/ training
            const training = new Training({
                trainingType: request.type,
                mentor: mentor,
                mentees: request.author,
                duration: request.duration,
                track: request.track,
                Salary: req.body.Salary,
            })
            await request.save();
            await training.save();
            res.status(200).json({ message: 'You accepted the request.' });
        }        
    } catch(err){
        console.error('Error replying the request.', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


module.exports = {
    Search,
    RequestRecommendedMentor,
    MentorAcOrRejRequest,
}