const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {

    //get token from request
    const token = req.query.token || req.headers.authoriation?.split(' ')[1];

    //cheak if token = NULL
    if (!token) {
        const err = new error('You can\'t accsess this feature befor login! ');
        err.statsCode = 401;
        throw err;
    }

    //decode token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SEKRET_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    //check decode
    if (!decodedToken) {
        const error = new Error('Invalid token');
        error.statusCode = 401;
        throw error;
    }
    //assecc userId to req
    req.userId = decodedToken.userId;

    //go to next middleware
    next();


}

module.exports = isAuth;