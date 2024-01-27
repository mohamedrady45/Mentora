const User = require('../Models/user')

const authService = require('../Services/auth')
const userService = require('../Services/user')

const OTP = require('sendgrid-mailer');
const otpGenerator = require('otp-generator');

const sendOTP = async(req, res, next) => {
    try {
        const { email } = req.body;
        
        // Find user by email
        const user = await userService.findUser('email', email);
        
        //send error if user dosen't exist
        if(!user)
        {
            const err = new Error('This email does not exist');
            err.statusCode = 404;
            throw err;
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

        //send OTP to user's mail
        const mailer = new OTP(apiKey, senderEmail);
        await mailer.sendOTP(email, otp);

        //response token , success msg ,status 200
        res.status(200).json({Token:token,msg:'OTP sent successfully'})
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
};