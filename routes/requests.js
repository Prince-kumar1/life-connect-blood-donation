const express = require('express');
const BloodRequest = require('../models/BloodRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all blood requests for donors
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const requests = await BloodRequest.find({ status: 'pending' })
      .populate('seekerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept blood request
router.put('/accept/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        acceptedBy: req.user._id
      },
      { new: true }
    ).populate('seekerId', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Make donor's blood donation unavailable
    const BloodDonation = require('../models/BloodDonation');
    await BloodDonation.findOneAndUpdate(
      { 
        donorId: req.user._id, 
        bloodGroup: request.bloodGroup,
        isAvailable: true 
      },
      { isAvailable: false }
    );

    // Create notification for seeker
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: request.seekerId._id,
      type: 'request_accepted',
      title: 'Blood Request Accepted!',
      message: `Your blood request for ${request.bloodGroup} has been accepted by ${req.user.name}.`,
      relatedRequestId: request._id,
      relatedUserId: req.user._id
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject blood request
router.put('/reject/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('seekerId', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete/Cancel blood request (for donors to remove from their view)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'donor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const request = await BloodRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // If donor accepted it, they can mark it as completed
    if (request.acceptedBy && request.acceptedBy.toString() === req.user._id.toString()) {
      await BloodRequest.findByIdAndUpdate(req.params.id, { status: 'completed' });
      res.json({ message: 'Request marked as completed' });
    } else {
      res.status(403).json({ message: 'Cannot delete this request' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;