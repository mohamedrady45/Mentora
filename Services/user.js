const User=require('../Models/user')

class userService {
   
    static async findUser(parama,value,...arg)
    {
      return await User.findOne({[parama]: value}).populate(...arg).exec();
    }
    
    static async findByIdAndUpdate(userId,parama,value)
    {
      const user =await User.findOne( {_id: userId} ) ; 
      user[parama]=value.toString();
      return await user.save()
      
    }
    
}
  
  module.exports = userService;