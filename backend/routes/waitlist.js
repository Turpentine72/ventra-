const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const WaitlistUser = require('../models/WaitlistUser');

// Get all waitlist users
router.get('/', async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        const result = await WaitlistUser.findAll({ search, category, page, limit });
        res.json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
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
        console.error('Error fetching user:', error);
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

            // Handle "Other" category
            let businessCategory = req.body.businessCategory;
            if (businessCategory === 'Other' && req.body.otherCategory) {
                businessCategory = req.body.otherCategory;
            }

            const userData = {
                business_name: req.body.businessName,
                full_name: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone,
                business_category: businessCategory,
                feature_interest: req.body.featureInterest,
                instagram: req.body.instagram || ''
            };

            const user = await WaitlistUser.create(userData);
            res.status(201).json(user);
        } catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({ message: 'Email already registered' });
            }
            console.error('Error creating user:', error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete waitlist user
router.delete('/:id', async (req, res) => {
    try {
        console.log('Delete request received for ID:', req.params.id);
        
        const result = await WaitlistUser.delete(req.params.id);
        console.log('Delete result:', result);
        
        res.json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to delete user' 
        });
    }
});

// Get dashboard stats
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await WaitlistUser.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;