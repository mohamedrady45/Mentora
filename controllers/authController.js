const bcrypt = require('bcrypt');
const User = require('../Models/user');
const OTPService = require('../services/OTP');
const authService = require('../services/auth');
const userService = require('../services/user');
const hashingService = require('../services/hashing');
let otp ;
let newUser ;
const generateOTPAndSendEmail = async (email) => {
    const otpService = new OTPService();
    const otp = await otpService.generateOTP();
    console.log(`Generated OTP is ${otp}`);
    await otpService.sendEmail(email, otp);
    return otp;
};

const register = async (req, res, next) => {
    try {
        // Extract data from request body
        const { firstName, lastName, email, password, dateOfBirth, gender, country, bio, profilePicture, languages, interests } = req.body;

        const oldUser = await userService.findUser('email', email);

        if (oldUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Generate OTP and send email
         otp = await generateOTPAndSendEmail(email);

        // Hash password
        const hashedPassword = await hashingService.hashPassword(password);

        // Create new user instance
         newUser = new User({
            firstName, lastName, email, password: hashedPassword, dateOfBirth, gender, country, bio, profilePicture, languages, interests,
        });

        // Return success message
        return res.status(201).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { inputOtp } = req.body;
        if (otp == inputOtp) {
            await newUser.save();
            otp = null ;
            newUser = null ;
            res.status(200).json({ success: true, message: 'Registration completed successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login = async (req, res, next) => {
    try {
        // Extract data from request body
        const { email, password } = req.body;

        // Search for user by email
        const user = await userService.findUser('email', email);

        // Handle user not found
        if (!user) {
            const err = new Error('This email does not exist');
            err.statusCode = 404;
            throw err;
        }

        // Check if password matches
        const isMatch = await authService.authService.comparePassword(password, user.password);

        // Handle incorrect password
        if (!isMatch) {
            const err = new Error('Incorrect password');
            err.statusCode = 401;
            throw err;
        }

        // Generate token
        const tokenData = { userId: user._id };
        const token = await authService.authService.generateToken(tokenData, '10 days');

        // Response with token and success message
        res.status(200).json({ Token: token, message: 'Login successful' });
    } catch (err) {
        console.error('Error logging in:', err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports = {
    register,
    getAllUsers,
    login,
    verifyOTP,
};
