const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password must be at least 6 characters long']
    }
  });
  

const User = mongoose.model('User', userSchema);

module.exports = User;
