const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get admin profile
router.get('/profile/:id', async (req, res) => {
    try {
        console.log('Fetching profile for ID:', req.params.id);
        const admin = await Admin.findById(req.params.id);
        
        if (!admin) {
            console.log('Admin not found');
            return res.status(404).json({ message: 'Admin not found' });
        }
        
        console.log('Admin found:', admin);
        res.json(admin);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            message: 'Failed to load profile',
            error: error.message 
        });
    }
});

// Update admin profile
router.put('/profile/:id',
    [
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('phone').notEmpty().withMessage('Phone number is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const updateData = {
                full_name: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone
            };

            const admin = await Admin.update(req.params.id, updateData);
            
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            res.json(admin);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ 
                message: 'Failed to update profile',
                error: error.message 
            });
        }
    }
);

// Change password
router.put('/profile/:id/password',
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { currentPassword, newPassword } = req.body;
            
            // Get admin from database with password
            const { data: adminData, error: findError } = await supabase
                .from('admins')
                .select('*')
                .eq('id', req.params.id)
                .single();

            if (findError || !adminData) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, adminData.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            // Update password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            const { error: updateError } = await supabase
                .from('admins')
                .update({ password: hashedPassword })
                .eq('id', req.params.id);

            if (updateError) throw updateError;

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ 
                message: 'Failed to change password',
                error: error.message 
            });
        }
    }
);

// Login
router.post('/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;
            const admin = await Admin.findByEmail(email);

            if (!admin) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await Admin.comparePassword(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: admin.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                token,
                admin: {
                    id: admin.id,
                    fullName: admin.full_name,
                    email: admin.email,
                    phone: admin.phone,
                    role: admin.role,
                    profilePicture: admin.profile_picture
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                message: 'Server error',
                error: error.message 
            });
        }
    }
);

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({
            valid: true,
            admin: {
                id: admin.id,
                fullName: admin.full_name,
                email: admin.email,
                phone: admin.phone,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Seed admin (for first time setup)
router.post('/seed', async (req, res) => {
    try {
        console.log('Seed endpoint called');
        const result = await Admin.seedAdmin();
        console.log('Seed result:', result);
        res.json(result);
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ 
            message: 'Failed to seed admin',
            error: error.message 
        });
    }
});

module.exports = router;