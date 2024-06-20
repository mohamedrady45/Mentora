const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'You can\'t access this feature without logging in!' });
    }

    const token = authHeader.split(' ')[1];
    const cert = process.env.SECRET_KEY;

    jwt.verify(token, cert, { algorithms: ['HS256'] }, (err, payload) => {
        if (err) {
            console.error('Invalid signature:', err.message);
            return res.status(401).json({ message: 'Authentication failed' });
        } else {
            req.userId = payload.userId;
            next();
        }
    });
};

module.exports = isAuth;
