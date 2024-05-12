const jwt = require('jsonwebtoken');
const fs = require('fs');

const isAuth = async (req, res, next) => {
    // Get the authorization header
    const authHeader = req.get('Authorization');
    // Check if the token is present in the header
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'You can\'t access this feature without logging in!' });
    }
    // Get the token from the header
    const token = authHeader.split(' ')[1];
    // Verify the token
    try {
        // Read the public key
        const cert = process.env.SECRET_KEY;

        // Verify the token
        jwt.verify(token, cert, { algorithms: ['HS256'] }, (err, payload) => {
            if (err) {
                console.error('Invalid signature:', err.message);
                // Handle the error
            } else {
                // Token is valid, do something with the payload
                console.log('Token payload:', payload);
                req.userId = payload.userId;
            }
        });
        
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = isAuth;
