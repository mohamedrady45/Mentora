const JWT = require ('jsonwebtoken');

const isAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'You can\'t access this feature without logging in!' });
    }

    const token = authHeader.split(' ')[1];
 
    try {
        const decodedToken = JWT.verify(token, process.env.SECRET_KEY);
        if (!decodedToken) {
            throw new Error('Invalid token');
        }

        req.userId = decodedToken.userId;
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports =  isAuth;
