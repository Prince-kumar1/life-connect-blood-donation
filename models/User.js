const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['donor', 'seeker'], required: true },
  phone: { type: String },
  address: { type: String },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  isProfileComplete: { type: Boolean, default: false },
  originalEmail: { type: String } // For seeker accounts created by donors
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);