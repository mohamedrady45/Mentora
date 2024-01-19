const bcrypt = require('bcrypt');
const User = require('../models/User');

  const register =  async (req, res) => {
    try {
      const { firstName, lastName, email, password, dateOfBirth, gender, country, bio, profilePicture, languages, interests } = req.body;
      const olduser = await User.findOne ({email: email});
      if (olduser) {
        return res.status(400).json({error: 'email is already registered'});
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        gender,
        country,
        bio,
        profilePicture,
        languages,
        interests,
      });
      await newUser.save();
      newUser.password = hashedPassword;      
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' , err});
    }
  }; 
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

module.exports = {
    register , 
    getAllUsers
};
