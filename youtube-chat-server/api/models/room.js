const mongoose = require('mongoose');

const Room = mongoose.model('Room', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  visitedUsers: [{
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }],
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  messages: [{
    _message: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }]
});

module.exports = {
  Room
};
