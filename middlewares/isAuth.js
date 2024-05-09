const jwt = require('jsonwebtoken');
require('dotenv').config();
const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
    const error = new Error('Invalid Authorization header');
    error.statusCode = 401;
    throw error;
} 

     const token = authHeader.split(' ')[1];

    const decodedToken =  jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      const error = new Error('Invalid token');
      error.statusCode = 401;
      throw error;
    }
    
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error('Error in isAuth middleware:', error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = isAuth;
