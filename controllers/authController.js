
const User = require('../Models/user')

const authService = require('../Services/auth')
const userService = require('../Services/user')

const hashingService = require('../Services/hashingService');
const OTPService = require ('../Services/OTP')
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const sendOTP = async(req, res, next) =>{
    try{
        
        const{ email } = req.body;

        // Find user by email
        const user = await userService.findUser('email', email);

        // Send error if user doesn't exist
        if (!user) {
            const err = new Error('This email does not exist');
            err.statusCode = 404;
            throw err;
        }
        
        // send OTP
        const otpService = new OTPService();
        const otp = await otpService.generateOTP();
        console.log(otp);
        await otpService.sendEmail (email , otp);

        res.status(200).json({ message: 'OTP sent successfully', OTP : otp });

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
const verifyOTP = async ( req , res) =>{
    try { 
      const {inputOtp , otp} = req.body;
     if (otp == inputOtp ) {
      res.status(200).json({ success: true, message: ' You entered rigth OTP.' });
    }
     else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } 
 catch(error){
   console.error('Error verifying OTP:', error);
   res.status(500).json({ success: false, message: 'Failed to verify OTP' });
 }
}

const resetPassword = async(req, res, next) =>{
    try{
        const { email, newPassword} = req.body;

        const hashPassword = await hashingService.hashPassword(newPassword);
        
        // reset password 
        await User.findOneAndUpdate({email : email}, {password : hashPassword})

        
        

        res.status(200).json({ message: 'Password reset successfully' });

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
}


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
    sendOTP,
    verifyOTP,
    resetPassword, 
    login , 
}