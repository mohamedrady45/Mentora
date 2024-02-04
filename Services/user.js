const User=require('../Models/user')

class userService {
   
    static async findUser(parama,value)
    {
      return await User.findOne({[parama]: value}).exec();
    }
    
}
  
  module.exports = userService;