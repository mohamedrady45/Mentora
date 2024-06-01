const userService = require('../services/user');
const User=require('../Models/user')

const isMentor = async (req, res, next) => {
   
        const user = await  User.findById(req.userId);
        console.log(user);
        if (user && user.role === 'Mentor') {
            next();
        } else {
            res.status(403).send('Access denied. Mentor only.');
        }
};

module.exports = isMentor;
