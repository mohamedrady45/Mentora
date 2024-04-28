const jwt=require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const userService = require('./user');

class authService {
   
    static async comparePassword(inputPassword,userPassword)
    {
      return bcrypt.compare(inputPassword,userPassword);
    }

    static async generateToken(tokenData)
    {
      return jwt.sign(tokenData, process.env.SEKRET_KEY ,{expiresIn:'1d'});
    }
    
      static async generateRefreshToken(refreshTokenData) {
      const rtoken=  jwt.sign(refreshTokenData, process.env.REFRESH_SEKRET_KEY, { expiresIn: '1y' });
      await userService.findByIdAndUpdate(refreshTokenData.userId,'refreshToken',rtoken);
      return rtoken;
    }
  
    //* Function for check refresh token  */
    static async verifyRefreshToken(refreshToken) {
      try {
        let data = jwt.verify(refreshToken,process.env.REFRESH_SEKRET_KEY);
        const user =await userService.findUser('_id',data.userId);
        if(user.refreshToken === refreshToken ) return data;
        
      } catch (error) {
        return error;
      }
    };
    
    
    
}
  
  
  module.exports = authService;