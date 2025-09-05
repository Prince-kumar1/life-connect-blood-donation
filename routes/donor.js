const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update donor profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
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

// Get donor profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      bloodGroup: req.user.bloodGroup,
      isProfileComplete: req.user.isProfileComplete
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;