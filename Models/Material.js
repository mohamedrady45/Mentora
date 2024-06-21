const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attachmentSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['image', 'video', 'file'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  });
const MaterialSchema = new Schema({
    text: {
        type: String,
        required: true,
        default: 'New material'
    },
    attachmentsUrl:[attachmentSchema]

},
    {
        timestamps: true
    }
)

const materialModel = mongoose.model("Material", MaterialSchema);
module.exports = materialModel;