const bcrypt = require('bcrypt');
const User = require('../Models/user')
const OTPService = require('../services/OTP')
const authService = require('../services/auth')
const userService = require('../services/user')
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const otpGenerator = require('otp-generator');
const Mailgen = require('mailgen');
const hashingService = require('../services/hashing');
//const fetch = require('node-fetch');
const { datacatalog } = require('googleapis/build/src/apis/datacatalog');
let otp;
let newUser;
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, gender, country, bio, profilePicture, languages, interests } = req.body;
    const olduser = await User.findOne({ email: email });
    if (olduser) {
      return res.status(400).json({ error: 'email is already registered' });
    }
    const otpService = new OTPService();
     otp = await otpService.generateOTP();
    console.log(otp);
    await otpService.sendEmail(email, otp);
    const hashedPassword = await hashingService.hashPassword(password);
    newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      country,
      bio,
      profilePicture,
      languages,
      interests,
    });
    await newUser.save();
    return res.status(201).json({ message: 'otp sent seccessfuly' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', err });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { inputOtp } = req.body;
    if (otp == inputOtp) {
      await newUser.save();
      newUser = null;
      otp = null;
      res.status(200).json({ success: true, message: 'Registration completed successfully' });
    }
    else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
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
};

const login = async (req, res, next) => {
  try {
    //take data
    const { email, password } = req.body;

    
    //search for email in database
    const user = await userService.findUser('email', email);
    
    //send error if user dosen't exist
    if (!user) {
      const err = new Error('This email does not exist');
      err.statusCode = 404;
      throw err;
    }

    //check if password match user password
    const isMatch = await authService.authService.comparePassword(password, user.password);

    //send error if password in wrong
    if (!isMatch) {
      const err = new Error('Incorrect password');
      err.statusCODE = 401;
      throw err;
    }

    //creat token 

    /* TODO:Spacifice token data*/
    const tokenData = { userId: user._id };
    const token = await authService.authService.genrateToken(tokenData, "10 days")

    //response token , success msg ,status 200
    res.status(200).json({ Token: token, msg: 'Login successfully done!' })
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

const facebookLogin = async (req, res, next) => {
  const { userId, accessToken } = req.body;

  const urlGraphFacebook = `https://graph.facebook.com/v22.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
  fetch(urlGraphFacebook, {
    method: 'GET',
  }).then(resp => resp.json())
    .then(resp => {
      const { email, name } = resp;
      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return register.status(400).json({
            error: "something went wrong ....."
          })
        }
        else {
          if (user) {
            const token = genrateToken({ _id: userId }, '10h');
            const { _id, name, email } = user;
            res.json({
              token,
              user: { _id, name, email },
            })
          }
          else {
            const password = email;
            const newUser = new User({ name, email, password });
            newUser.save((err, data) => {
              if (err) {
                return res.status(400).json({ error: "something went wrong." })
              }
            })
            const token = genrateToken({ _id: data._id }, '10h');
            const { _id, name, email } = newUser;
            res.json({
              token,
              user: { _id, name, email },
            })
          }
        }
      })

    })
}
module.exports = {
  register,
  getAllUsers,
  login,
  verifyOTP,
  facebookLogin

}