const mongoose = require('mongoose');

const waitlistUserSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  businessCategory: {
    type: String,
    required: [true, 'Business category is required'],
    enum: ['Fashion Brand', 'Restaurant', 'School', 'Real Estate', 'Beauty Business', 'Other']
  },
  featureInterest: {
    type: String,
    required: [true, 'Feature interest is required'],
    enum: ['Online Payments', 'Product Management', 'Business Dashboard', 'Analytics', 'Custom Domain']
  },
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WaitlistUser', waitlistUserSchema);