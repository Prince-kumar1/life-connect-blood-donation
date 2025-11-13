const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, userType } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userType) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      userType
    });

    await user.save();
    console.log('User saved successfully:', user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        bloodGroup: user.bloodGroup,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    userType: req.user.userType,
    phone: req.user.phone,
    address: req.user.address,
    bloodGroup: req.user.bloodGroup,
    isProfileComplete: req.user.isProfileComplete
  });
});

// Check if donor has seeker account
router.get('/seeker-account', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Only donors can access this feature' });
    }

    const seekerAccount = await User.findOne({ 
      email: req.user.email + '_seeker'
    });

    if (seekerAccount) {
      res.json({ 
        exists: true, 
        seekerAccount: {
          name: seekerAccount.name,
          email: seekerAccount.originalEmail || req.user.email,
          bloodGroup: seekerAccount.bloodGroup,
          createdAt: seekerAccount.createdAt
        }
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Seeker account check error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Create seeker account for donor
router.post('/create-seeker-account', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Only donors can access this feature' });
    }

    // Check if seeker account already exists
    const seekerEmail = req.user.email + '_seeker';
    const existingSeeker = await User.findOne({ 
      email: seekerEmail
    });

    if (existingSeeker) {
      return res.status(400).json({ message: 'Seeker account already exists' });
    }

    // Create seeker account with modified email to avoid duplicate key error
    const seekerAccount = new User({
      name: req.user.name,
      email: seekerEmail,
      password: req.user.password, // Same password hash
      userType: 'seeker',
      phone: req.user.phone,
      address: req.user.address,
      bloodGroup: req.user.bloodGroup,
      isProfileComplete: req.user.isProfileComplete,
      originalEmail: req.user.email // Store original email for reference
    });

    await seekerAccount.save();

    res.json({ 
      message: 'Seeker account created successfully',
      seekerAccount: {
        name: seekerAccount.name,
        email: seekerAccount.originalEmail || req.user.email,
        bloodGroup: seekerAccount.bloodGroup,
        createdAt: seekerAccount.createdAt
      }
    });
  } catch (error) {
    console.error('Create seeker account error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Login to seeker account for donors
router.post('/seeker-login', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Only donors can access this feature' });
    }

    // Find seeker account
    const seekerAccount = await User.findOne({ 
      email: req.user.email + '_seeker'
    });

    if (!seekerAccount) {
      return res.status(404).json({ message: 'Seeker account not found. Please create one first.' });
    }

    // Generate token for seeker account
    const token = jwt.sign(
      { userId: seekerAccount._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: seekerAccount._id,
        name: seekerAccount.name,
        email: seekerAccount.originalEmail || req.user.email,
        userType: seekerAccount.userType,
        phone: seekerAccount.phone,
        address: seekerAccount.address,
        bloodGroup: seekerAccount.bloodGroup,
        isProfileComplete: seekerAccount.isProfileComplete
      }
    });
  } catch (error) {
    console.error('Seeker login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Check if seeker has donor account
router.get('/donor-account', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Only seekers can access this feature' });
    }

    const donorAccount = await User.findOne({ 
      email: req.user.email + '_donor'
    });

    if (donorAccount) {
      res.json({ 
        exists: true, 
        donorAccount: {
          name: donorAccount.name,
          email: donorAccount.originalEmail || req.user.email,
          bloodGroup: donorAccount.bloodGroup,
          createdAt: donorAccount.createdAt
        }
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Donor account check error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Create donor account for seeker
router.post('/create-donor-account', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Only seekers can access this feature' });
    }

    // Check if donor account already exists
    const donorEmail = req.user.email + '_donor';
    const existingDonor = await User.findOne({ 
      email: donorEmail
    });

    if (existingDonor) {
      return res.status(400).json({ message: 'Donor account already exists' });
    }

    // Create donor account with modified email to avoid duplicate key error
    const donorAccount = new User({
      name: req.user.name,
      email: donorEmail,
      password: req.user.password, // Same password hash
      userType: 'donor',
      phone: req.user.phone,
      address: req.user.address,
      bloodGroup: req.user.bloodGroup,
      isProfileComplete: req.user.isProfileComplete,
      originalEmail: req.user.email // Store original email for reference
    });

    await donorAccount.save();

    res.json({ 
      message: 'Donor account created successfully',
      donorAccount: {
        name: donorAccount.name,
        email: donorAccount.originalEmail || req.user.email,
        bloodGroup: donorAccount.bloodGroup,
        createdAt: donorAccount.createdAt
      }
    });
  } catch (error) {
    console.error('Create donor account error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Login to donor account for seekers
router.post('/donor-login', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'seeker') {
      return res.status(403).json({ message: 'Only seekers can access this feature' });
    }

    // Find donor account
    const donorAccount = await User.findOne({ 
      email: req.user.email + '_donor'
    });

    if (!donorAccount) {
      return res.status(404).json({ message: 'Donor account not found. Please create one first.' });
    }

    // Generate token for donor account
    const token = jwt.sign(
      { userId: donorAccount._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: donorAccount._id,
        name: donorAccount.name,
        email: donorAccount.originalEmail || req.user.email,
        userType: donorAccount.userType,
        phone: donorAccount.phone,
        address: donorAccount.address,
        bloodGroup: donorAccount.bloodGroup,
        isProfileComplete: donorAccount.isProfileComplete
      }
    });
  } catch (error) {
    console.error('Donor login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete user account and all related data
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.user.userType;
    
    // Delete user-specific data based on user type
    if (userType === 'donor') {
      // Delete blood donations
      const BloodDonation = require('../models/BloodDonation');
      await BloodDonation.deleteMany({ donorId: userId });
      
      // Delete blood requests where this donor was involved
      const BloodRequest = require('../models/BloodRequest');
      await BloodRequest.deleteMany({ acceptedBy: userId });
    } else if (userType === 'seeker') {
      // Delete blood requests created by this seeker
      const BloodRequest = require('../models/BloodRequest');
      await BloodRequest.deleteMany({ seekerId: userId });
    }
    
    // Delete notifications related to this user
    const Notification = require('../models/Notification');
    await Notification.deleteMany({ 
      $or: [
        { userId: userId },
        { relatedUserId: userId }
      ]
    });
    
    // Finally delete the user account
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Account and all related data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;