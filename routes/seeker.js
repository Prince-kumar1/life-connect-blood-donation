const express = require('express');
const User = require('../models/User');
const BloodDonation = require('../models/BloodDonation');
const BloodRequest = require('../models/BloodRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Update seeker profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, phone, address, bloodGroup } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        address,
        bloodGroup,
        isProfileComplete: true
      },
      { new: true }
    );

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      bloodGroup: updatedUser.bloodGroup,
      isProfileComplete: updatedUser.isProfileComplete
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available blood donations
router.get('/available-blood', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donations = await BloodDonation.find({ isAvailable: true })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });

    // Filter contact details based on privacy settings
    const filteredDonations = donations.map(donation => {
      const donationObj = donation.toObject();
      if (!donationObj.showContactDetails) {
        // Hide contact details if privacy is enabled
        donationObj.donorEmail = null;
        donationObj.donorPhone = null;
      }
      return donationObj;
    });

    res.json(filteredDonations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blood request
router.post('/request-blood', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { bloodGroup, urgency, location, contactPhone, message, donorId } = req.body;

    const bloodRequest = new BloodRequest({
      seekerId: req.user._id,
      bloodGroup,
      urgency,
      location,
      contactPhone,
      message,
      donorId
    });

    await bloodRequest.save();
    res.status(201).json(bloodRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seeker's blood requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await BloodRequest.find({ seekerId: req.user._id })
      .populate('acceptedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;