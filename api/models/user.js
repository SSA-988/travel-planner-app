// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    photo: {type: String},
    token: {type: String},
  },
  {timestamps: true},
);

module.exports = mongoose.model('User', userSchema);
