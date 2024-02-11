const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Add more community-related fields as needed
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;