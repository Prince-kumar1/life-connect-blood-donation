const express = require('express');
const BloodDonation = require('../models/BloodDonation');
const auth = require('../middleware/auth');

const router = express.Router();

// Add blood donation
router.post('/donate', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { bloodGroup, donorEmail, donorPhone, location, showContactDetails } = req.body;

    const bloodDonation = new BloodDonation({
      donorId: req.user._id,
      bloodGroup,
      donorEmail,
      donorPhone,
      location,
      showContactDetails: showContactDetails || false
    });

    await bloodDonation.save();
    res.status(201).json(bloodDonation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donor's blood donations
router.get('/my-donations', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donations = await BloodDonation.find({ donorId: req.user._id });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blood donation
router.put('/donation/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { bloodGroup, donorEmail, donorPhone, location, isAvailable, showContactDetails } = req.body;

    const donation = await BloodDonation.findOneAndUpdate(
      { _id: req.params.id, donorId: req.user._id },
      { bloodGroup, donorEmail, donorPhone, location, isAvailable, showContactDetails },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blood donation
router.delete('/donation/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const donation = await BloodDonation.findOneAndDelete({
      _id: req.params.id,
      donorId: req.user._id
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({ message: 'Donation removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;