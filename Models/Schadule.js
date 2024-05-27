const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schaduleSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ['training', 'session'],
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from:{
        type:Schema.Types.ObjectId,
        ref: function () {
            return this.type === 'training' ? 'Training' : 'Session';
        },
        required: true
    },
    date: {
        type: Date,
        require: true
    }


})

const SchaduleModel = mongoose.model("Schadule", schaduleSchema);
module.exports = SchaduleModel;