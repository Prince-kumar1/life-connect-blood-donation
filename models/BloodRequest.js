const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'medium' },
  location: { type: String, required: true },
  contactPhone: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled', 'rejected'], default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);