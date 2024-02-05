const User = require('../Models/user');
const OTPService = require('../services/OTP');
const authService = require('../services/auth');
const userService = require('../services/user');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const hashingService = require('../services/hashing');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("899300165493-hdf7qc1omn1qe8fa031t5un6mm8v3g5k.apps.googleusercontent.com");
let otp ;
let newUser;

const generateOTPAndSendEmail = async (email, next) => {
    try {
        const otpService = new OTPService();
        const otp = await otpService.generateOTP();
        console.log(`Generated OTP is ${otp}`);
        await otpService.sendEmail(email, otp);
        return otp;
    } catch (err) {
        console.error('Error generating OTP and sending email:', err);
        next(err);
    }
};

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, dateOfBirth, gender, country, bio, profilePicture, languages, interests } = req.body;

        const oldUser = await userService.findUser('email', email);

        if (oldUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

         otp = await generateOTPAndSendEmail(email, next);
        const hashedPassword = await hashingService.hashPassword(password);

         newUser = new User({
            firstName, lastName, email, password: hashedPassword, dateOfBirth, gender, country, bio, profilePicture, languages, interests,
        });

        return res.status(201).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        next(err);
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { inputOtp } = req.body;
        if (otp === inputOtp) {
            await newUser.save();
            otp = null;
            newUser = null;
            res.status(200).json({ success: true, message: 'Registration completed successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        next(error);
    }
};

const resetPassword = async(req, res, next) =>{
    try{
        const { email, newPassword} = req.body;
      
        const hashPassword = await hashingService.hashPassword(newPassword);
        
        await User.findOneAndUpdate({email : email}, {password : hashPassword});

        res.status(200).json({ message: 'Password reset successfully' });
    }
  }
      const getAllUsers = async (req, res) => {
        try {
            const users = await User.find();
            console.log(users);
            res.status(200).json(users);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
      } ;
    
const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findUser('email', email);

        if (!user) {
            return res.status(404).json({ error: 'This email does not exist' });
        }

        const isMatch = await authService.authService.comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const tokenData = { userId: user._id };
        const token = await authService.authService.generateToken(tokenData, '10 days');

        res.status(200).json({ Token: token, message: 'Login successful' });
    } catch (err) {
        console.error('Error logging in:', err);
        next(err);
    }
};

const facebookLogin = async (req, res, next) => {
    try {
  
      const { userId, accessToken } = req.body;
  
      const urlGraphFacebook = `https://graph.facebook.com/v22.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
      const response = await fetch(urlGraphFacebook, { method: 'GET', });
      const resData = await response.json();
      const { first_name, last_name, email, birthday, gender } = resData;
      const user = await userService.findUser('email', email);
      if (!user) {
        const err = new Error('This email does not exist');
        err.statusCode = 404;
        throw err;
      }
      // Generate token
      const tokenData = { userId: user._id };
      const token = await authService.authService.generateToken(tokenData, '10 days');
  
      // Response with token and success message
      res.status(200).json({ Token: token, message: 'Login successful' });
    }
    catch(err) {
      console.log("Facebook Login error");
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  const facebookRegister = async (req, res, next) => {
    try {
  
      const { userId, accessToken } = req.body;
  
      //Get data from graph Facebook
      const urlGraphFacebook = `https://graph.facebook.com/v22.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
      const response = await fetch(urlGraphFacebook, { method: 'GET', });
      const resData = await response.json();
      const { first_name, last_name, email, birthday, gender } = resData;
  
      //if  the user already exists in our database 
      const oldUser = await userService.findUser('email', email);
  
      if (oldUser) {
        // Generate token
        const tokenData = { userId: user._id };
        const token = await authService.authService.generateToken(tokenData, '10 days');
  
        // Response with token and success message
        return res.status(200).json({ Token: token, message: 'facebook Login successful' });
      }
  
      //Create a new User
      const hashedPassword = await hashingService.hashPassword(email+process.env.SEKRET_KEY);
      const user = new User({ firstName: first_name, lastName: last_name, email, password: hashedPassword, dateOfBirth: birthday, gender: gender === 'male' ? 'Male' : 'Female' });
      await user.save();
  
      // Generate token
      const tokenData = { userId: user._id };
      const token = await authService.authService.generateToken(tokenData, '10 days');
  
      // Response with token and success message
      res.status(200).json({ Token: token, message: 'facebook register successful' });
    }
    catch (err){
      console.log("Facebook register error");
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  
  const googlelogin = async (req, res, next) => {
   
  
    try {
      const { tokenId } = req.body;
      const response = await client.verifyIdToken({ idToken: tokenId, audience: "899300165493-hdf7qc1omn1qe8fa031t5un6mm8v3g5k.apps.googleusercontent.com" });
      const { email_verfied, given_name,family_name, email } = response.Payload;
      // Checking if the email is verified by Google or not
      if(!email_verfied) {
        return res.status(403).send({message:'Email is not Verified'});
      }
      
      // Get the user from database using their email address
  
      const user = await userService.findUser('email', email);
      if (!user) {
        const err = new Error('This email does not exist');
        err.statusCode = 404;
        throw err;
      }
      // Generate token
      const tokenData = { userId: user._id };
      const token = await authService.authService.generateToken(tokenData, '10 days');
  
      // Response with token and success message
      res.status(200).json({ Token: token, message: 'Login successful' });
     }
    catch (err){
      console.log("Facebook Login error");
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  
  }
  const googleRegister = async (req, res, next) => {
    try {
  
      const { tokenId } = req.body;
      const response = await client.verifyIdToken({ idToken: tokenId, audience: "899300165493-hdf7qc1omn1qe8fa031t5un6mm8v3g5k.apps.googleusercontent.com" });
      const { email_verfied, given_name,family_name, email } = response.Payload;
  
      // Checking if the email is verified by Google or not
      if(!email_verfied) {
        return res.status(403).send({message:'Email is not Verified'});
      }
  
      //if  the user already exists in our database 
      const oldUser = await userService.findUser('email', email);
  
      if (oldUser) {
        // Generate token
        const tokenData = { userId: user._id };
        const token = await authService.authService.generateToken(tokenData, '10 days');
  
        // Response with token and success message
        return res.status(200).json({ Token: token, message: 'facebook Login successful' });
      }
  
      //Create a new User
      const hashedPassword = await hashingService.hashPassword(email+process.env.SEKRET_KEY);
      const user = new User({ firstName: given_name, lastName: family_name, email, password: hashedPassword, /*TODO:dateOfBirth: birthday, gender: gender === 'male' ? 'Male' : 'Female'*/ });
      await user.save();
  
      // Generate token
      const tokenData = { userId: user._id };
      const token = await authService.authService.generateToken(tokenData, '10 days');
  
      // Response with token and success message
      res.status(200).json({ Token: token, message: 'google register successful' });
    }
    catch (err){
      console.log("google register error");
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  module.exports = {
    register,
    getAllUsers,
    login,
    verifyOTP,
    googlelogin,
    facebookLogin,
    facebookRegister,
    resetPassword,
    googleRegister
  };
