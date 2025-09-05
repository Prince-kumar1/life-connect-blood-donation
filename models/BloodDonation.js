const mongoose = require('mongoose');

const bloodDonationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  lastDonationDate: { type: Date },
  location: { type: String },
  showContactDetails: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);