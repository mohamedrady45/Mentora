const userService = require('../services/user');
const jwt = require('jsonwebtoken');
const User=require('../Models/user')

const adminOnly = async (req, res, next) => {
   
        console.log(req.userId);
        const user = await  User.findById(req.userId);
        console.log(user);
        if (user && user.role === 'Admin') {
            next();
        } else {
            res.status(403).send('Access denied. Admins only.');
        }
};

module.exports = adminOnly;
