import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Check, ArrowLeft, Users, Loader2 } from 'lucide-react';
import { waitlistAPI } from '../utils/supabase';

const Waitlist = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    businessCategory: '',
    featureInterest: '',
    instagram: ''
  });

  const [otherCategory, setOtherCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // Get current count for queue position
    const getCount = async () => {
      try {
        const stats = await waitlistAPI.getStats();
        setQueuePosition(stats.totalUsers + 1);
      } catch (error) {
        console.error('Error getting count:', error);
      }
    };
    getCount();
  }, []);

  const businessCategories = [
    'Fashion Brand',
    'Restaurant',
    'School',
    'Real Estate',
    'Beauty Business',
    'Other'
  ];

  const featureOptions = [
    'Online Payments',
    'Product Management',
    'Business Dashboard',
    'Analytics',
    'Custom Domain'
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'businessName':
        return !value.trim() ? 'Business name is required' : '';
      case 'fullName':
        return !value.trim() ? 'Full name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        return '';
      case 'businessCategory':
        return !value ? 'Please select a business category' : '';
      case 'featureInterest':
        return !value ? 'Please select a feature' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleOtherCategoryChange = (e) => {
    setOtherCategory(e.target.value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = ['businessName', 'fullName', 'email', 'phone', 'businessCategory', 'featureInterest'];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
    });

    if (formData.businessCategory === 'Other' && !otherCategory.trim()) {
      newErrors.otherCategory = 'Please specify your business category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SINGLE handleSubmit function - the improved version
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get current count for queue position
      const stats = await waitlistAPI.getStats();
      const newPosition = stats.totalUsers + 1;

      // Prepare data
      let businessCategory = formData.businessCategory;
      if (businessCategory === 'Other' && otherCategory.trim()) {
        businessCategory = otherCategory.trim();
      }

      const submitData = {
        business_name: formData.businessName.trim(),
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        business_category: businessCategory,
        feature_interest: formData.featureInterest,
        instagram: formData.instagram ? formData.instagram.trim() : ''
      };

      console.log('Submitting data:', submitData);

      const result = await waitlistAPI.create(submitData);
      console.log('Submission result:', result);
      
      setQueuePosition(newPosition);
      setIsSubmitted(true);
      toast.success('Successfully joined the waitlist!');
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Check for specific error types
      if (error.code === '23505') {
        toast.error('This email is already registered on the waitlist.');
      } else if (error.code === '23502') {
        toast.error('Missing required field. Please fill in all required fields.');
      } else if (error.message && error.message.includes('duplicate key')) {
        toast.error('This email is already registered on the waitlist.');
      } else {
        // Show detailed error in console for debugging
        console.error('Full error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast.error('Failed to join waitlist. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-20">
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-white/80 text-sm font-medium">Early Access</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Join the Ventra Waitlist
            </h1>
            
            <p className="text-[#94A3B8] text-base max-w-2xl mx-auto leading-relaxed">
              Be among the first businesses to experience Ventra. Join our waitlist today 
              and get notified when we officially launch.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Business Name */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Business Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your business name"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.businessName && touched.businessName ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200`}
                  />
                  {errors.businessName && touched.businessName && (
                    <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.fullName && touched.fullName ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200`}
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Email Address <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.email && touched.email ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Phone Number <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your phone number"
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.phone && touched.phone ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Business Category */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Business Category <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.businessCategory && touched.businessCategory ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 appearance-none`}
                  >
                    <option value="" className="bg-[#020617] text-[#94A3B8]">
                      Select Business Category
                    </option>
                    {businessCategories.map((category) => (
                      <option key={category} value={category} className="bg-[#020617] text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.businessCategory && touched.businessCategory && (
                    <p className="text-red-400 text-sm mt-1">{errors.businessCategory}</p>
                  )}
                  
                  {/* Show text input when "Other" is selected */}
                  {formData.businessCategory === 'Other' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        name="otherCategory"
                        value={otherCategory}
                        onChange={handleOtherCategoryChange}
                        placeholder="Please specify your business category"
                        className={`w-full px-4 py-3 bg-white/5 border ${
                          errors.otherCategory ? 'border-red-500' : 'border-white/10'
                        } rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200`}
                      />
                      {errors.otherCategory && (
                        <p className="text-red-400 text-sm mt-1">{errors.otherCategory}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Feature Interest */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Which Feature Do You Need Most? <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    name="featureInterest"
                    value={formData.featureInterest}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.featureInterest && touched.featureInterest ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white focus:outline-none focus:border-[#D4AF37] transition-colors duration-200 appearance-none`}
                  >
                    <option value="" className="bg-[#020617] text-[#94A3B8]">
                      Select a Feature
                    </option>
                    {featureOptions.map((feature) => (
                      <option key={feature} value={feature} className="bg-[#020617] text-white">
                        {feature}
                      </option>
                    ))}
                  </select>
                  {errors.featureInterest && touched.featureInterest && (
                    <p className="text-red-400 text-sm mt-1">{errors.featureInterest}</p>
                  )}
                </div>

                {/* Instagram (Optional) */}
                <div>
                  <label className="block text-white font-medium text-sm mb-1.5">
                    Instagram Username <span className="text-[#94A3B8] text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="@yourbrand"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>

                <p className="text-center text-[#94A3B8] text-sm">
                  We'll notify you as soon as Ventra launches. No spam—just important updates.
                </p>
              </form>
            ) : (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-[#D4AF37]" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  🎉 Welcome to Ventra!
                </h2>
                
                <p className="text-[#94A3B8] text-base max-w-md mx-auto mb-8 leading-relaxed">
                  You're officially on the Ventra waitlist. We'll notify you as soon as we launch.
                </p>

                {/* Queue Position */}
                <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-8 py-4 mb-8">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-[#94A3B8] text-sm">Position in Queue</p>
                    <p className="text-white font-bold text-3xl">#{queuePosition}</p>
                  </div>
                </div>

                {/* Return Home Button */}
                <RouterLink to="/">
                  <button className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-2 mx-auto">
                    <ArrowLeft className="w-4 h-4" />
                    Return Home
                  </button>
                </RouterLink>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          {!isSubmitted && (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>No spam, just updates</span>
              </div>
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Early access priority</span>
              </div>
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Exclusive launch perks</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Waitlist;