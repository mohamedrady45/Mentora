const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['training', 'session'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: function () {
      return this.type === 'training' ? 'Training' : 'Session';
    },
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meetingLink: {
    type: String 
  }
});

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);
module.exports = ScheduleModel;
