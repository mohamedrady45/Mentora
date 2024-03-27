const jwt = require('jsonwebtoken');

const isAuth = async(req, res, next) => {

    //get token from request
    const token = req.headers['authorization'].split(' ')[1];
    

    //cheak if token = NULL
    if (!token) {
        const err = new Error('You can\'t accsess this feature befor login! ');
        err.statsCode = 401;
        throw err;
    }

    //decode token
    let decodedToken;

    decodedToken = await jwt.verify(token, process.env.SEKRET_KEY);
    

    //check decode
    if (!decodedToken) {
        const error = new Error('Invalid token');
        error.statusCode = 401;
        throw error;
    }

    //access userId to req
    req.userId = decodedToken.userId;

    //go to next middleware
    next();

}

module.exports = isAuth;