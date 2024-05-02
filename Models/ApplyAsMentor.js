const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
  
  track: [{
    type: String,
    required: true,
  }],
  experience: {
    type: String,
    required: true,
  },
  YearOfExperience: {
    type: Number,
  },
  LinkedinUrl: {
    type: String,
    required: true,
  },
  GithubUrl: {
    type: String,
    required: true,
  },
  CV: {
    type: String,
    required: true,
  }
  },

    {
      timestamps: true
    }
);

const Application = mongoose.model('Application',ApplicationSchema);
module.exports = Application;
