const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate : [validator.isEmail , 'please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
        },
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
          validator: (value) => {
            // Validate date format (YYYY-MM-DD)
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
        required : true 
      } , 
      gender: {
        type: String,
        enum: ['Male', 'Female'], 
        required: true,
      },
    bio :{
    type : String ,
    } , 
   profilePicture:{
   type : String ,
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