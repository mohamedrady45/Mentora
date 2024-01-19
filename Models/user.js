const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true , 'first name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true , 'last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true , 'email is required'],
      unique: [true , 'user with email is already registered'],
      trim: true,
      lowercase: true,
      validate : [validator.isEmail , 'please enter a valid email'],
    },
    password: {
      type: String,
      required: [true , 'please enter a password'],
      validate: {
        validator: function (value) {
            if (value.length<8)
            return false;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]/.test(value);
        },
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    },
    dateOfBirth: {
        type: Date,
        required: [true , 'please enter your date of birth'],
        validate: {
          validator: (value) => {
            if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
              return false;
            }
    
            // Validate age (must be at least 18 years old)
            const eighteenYearsAgo = moment().subtract(18, 'years');
            if (moment(value).isAfter(eighteenYearsAgo)) {
              return false;
            }
    
            // Validate date is not in the future
            return moment(value).isSameOrBefore(moment());
          },
          message: 'Please enter a valid date of birth (YYYY-MM-DD) and ensure you are at least 18 years old.',
        },
      },
      country : {
        type : String , 
        required : [true , 'please enter your country'] 
      } , 
      gender: {
        type: String,
        enum: ['Male', 'Female'], 
        required: [true , 'please select your gender'],
      },
    bio :{
    type : String ,
    } , 
   profilePicture:{
   type : String ,
   default:"" ,
   } , 
   languages: {
    type: [String],
    default: [], 
  },
  interests: {
    type: [String],
    default: [], 
  },
  });
const User = mongoose.model('User', userSchema);
module.exports = User;