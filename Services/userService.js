const User=require('../Models/user')

class userService {
   
    static async findUser(parama,value)
    {
      return User.findOne({[parama]: value}).exec();
    }
    
}
  
  module.exports = userService;