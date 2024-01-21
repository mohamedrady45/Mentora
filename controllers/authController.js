const User=require('../Models/user')

const authService =require('../Services/auth')
const userService=require('../Services/user')



const login = async(req, res, next) => {
    try {
        //take data
        const { email, password } = req.body;
        
        //search for email in database
        const user = await userService.findUser('email',email);
            
        //send error if user dosen't exist
        if(!user)
        {
            const err=new Error('This email does not exist');
            err.statusCode=404;
            throw err;
        }

        //check if password match user password
        const isMatch = await authService.comparePassword(password,user.password);

        //send error if password in wrong
        if(!isMatch)
        {
            const err=new Error('Incorrect password');
            err.statusCODE=401;
            throw err;
        }

        //creat token 
        
        /* TODO:Spacifice token data*/
        const tokenData={userId:user._id};
        const token = await authService.genrateToken(tokenData,"10 days")

        //response token , success msg ,status 200
        res.status(200).json({Token:token,msg:'Login successfully done!'})
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }

}

module.exports = {
    login, 
};