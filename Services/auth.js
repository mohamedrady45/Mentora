const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs');

class authService {
   
    static async comparePassword(inputPassword,userPassword)
    {
      return bcrypt.compare(inputPassword,userPassword);
    }
    static async genrateToken(tokenData,jwt_expire)
    {
      return jwt.sign(tokenData, process.env.SEKRET_KEY ,{expiresIn:jwt_expire});
    }
}
  
  module.exports = authService;