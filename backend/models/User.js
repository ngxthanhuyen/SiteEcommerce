const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  photo_profil: { type: String, default: 'avatar.jpg' }, 
  creation_date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('User', userSchema);
