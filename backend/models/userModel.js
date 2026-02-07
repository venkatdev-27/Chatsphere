const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true,
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;
