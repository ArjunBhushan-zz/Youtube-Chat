const mongoose = require('mongoose');

const Message = mongoose.model('Message', {
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = {
  Message
};
