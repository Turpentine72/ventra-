const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const WaitlistUser = require('../models/WaitlistUser');

// Get all waitlist users
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.businessCategory = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await WaitlistUser.countDocuments(query);
    const users = await WaitlistUser.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single waitlist user
router.get('/:id', async (req, res) => {
  try {
    const user = await WaitlistUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create waitlist user
router.post('/',
  [
    body('businessName').notEmpty().withMessage('Business name is required'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('businessCategory').notEmpty().withMessage('Business category is required'),
    body('featureInterest').notEmpty().withMessage('Feature interest is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = new WaitlistUser(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete waitlist user
router.delete('/:id', async (req, res) => {
  try {
    const user = await WaitlistUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats/summary', async (req, res) => {
  try {
    const totalUsers = await WaitlistUser.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await WaitlistUser.countDocuments({
      createdAt: { $gte: today }
    });

    // Most requested feature
    const featureStats = await WaitlistUser.aggregate([
      { $group: { _id: '$featureInterest', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Most popular business category
    const categoryStats = await WaitlistUser.aggregate([
      { $group: { _id: '$businessCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      totalUsers,
      newToday,
      mostRequestedFeature: featureStats[0]?._id || 'N/A',
      mostPopularCategory: categoryStats[0]?._id || 'N/A'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;