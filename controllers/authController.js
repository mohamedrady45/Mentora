const User = require('../Models/user')

const authService = require('../Services/auth')
const userService = require('../Services/user')

const hashingService = require('../Services/hashing');


const verifyResetOTP   = async(req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user by email
        const user = await userService.findUser('email', email);

        // Send error if user doesn't exist
        if (!user) {
            const err = new Error('This email does not exist');
            err.statusCode = 404;
            throw err;
        }

        // Check if OTP is valid
        if (user.otp !== otp) {
            const err = new Error('Invalid OTP');
            err.statusCode = 401;
            throw err;
        }
        
        // Update user's password
        user.password = await hashingService.hashPassword(newPassword);
        await userService.updateUser(user);

        res.status(200).json({ message: 'Password reset successfully' });
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
}
module.exports = {
    verifyResetOTP, 
};