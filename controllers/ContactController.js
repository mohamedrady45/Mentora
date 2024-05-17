const Mentor = require('../Models/user');
const Request = require('../Models/RequestMentor');

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
        const mentor = await Mentor.findById(req.body);
        if(!mentor){
            return res.status(404).json({ message: 'No mentor selected' });
        }

        const request = await Request.findById(req.params.id);
        if(!request){
            return res.status(404).json({ message: 'There is no request' });
        }

        mentor.requests.push(req.params.id)
        await mentor.save();

        res.status(200).json({ message: 'You shared the post.' });

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
        const mentor = Mentor.findById(req.userId);
        if (!mentor) {
            return res.status(404).json({ error: 'User not found' });
        }
        const {action} = req.body;

        const request = await Request.findById(req.params.id);
        if(!request){
            return res.status(404).json({ message: 'There is no request' });
        }
        //mentor rejects the request
        if(action === "reject"){
            mentor.requests = mentor.requests.filter(req => req.toString() !== req.params.id);
            request.status = 'rejected';
        } else if (action === "accept"){
            //mentor accepts the request
            request.status = 'accepted';
            mentor.trainings.push(request);
        }        
        await mentor.save();
        await request.save();
        res.status(200).json({ message: 'Thanks for showing your opinion in the request.' });
    } catch(err){
        console.error('Error .', err);
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