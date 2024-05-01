const jwt = require('jsonwebtoken');

const isAuth = async(req, res, next) => {
    const x=req.headers['authorization']
    
    if(!x||!x.startsWith('Bearer'))
    {
        res.status(401).json({msg:'no auth'});

    }
    //get token from request
    const token = x.split(' ')[1];
    

    //cheak if token = NULL
    if (!token) {
        const err = new Error('You can\'t accsess this feature befor login! ');
        err.statsCode = 401;
        throw err;
    }

    //decode token
    let decodedToken;

    decodedToken = await jwt.verify(token, process.env.SECRET_KEY);
    

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