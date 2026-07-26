import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { adminAPI } from '../../utils/supabase';
import Logo from '../../assets/logo.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Simple authentication for frontend-only app
      // In production, you'd want proper JWT authentication
      const admin = await adminAPI.findByEmail(formData.email);
      
      if (!admin) {
        toast.error('Invalid credentials');
        return;
      }

      // Simple password check (for demo purposes)
      if (formData.password === 'admin123456' && formData.email === 'admin@ventra.com') {
        // Store admin data in localStorage
        localStorage.setItem('adminId', admin.id);
        localStorage.setItem('adminData', JSON.stringify({
          id: admin.id,
          fullName: admin.full_name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role
        }));
        
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#D4AF37]/10"
          style={{ boxShadow: '0 0 100px rgba(212, 175, 55, 0.05)' }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#D4AF37]/5"
          style={{ boxShadow: '0 0 150px rgba(212, 175, 55, 0.03)' }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={Logo} 
              alt="Ventra Logo" 
              className="h-16 w-auto object-contain mx-auto"
            />
            <h1 className="text-2xl font-bold text-white mt-4">Welcome Back</h1>
            <p className="text-[#94A3B8] text-sm mt-1">Sign in to your admin account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white font-medium text-sm mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@ventra.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium text-sm mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="text-center text-[#94A3B8] text-xs">
              Protected by industry-standard security
            </p>
          </form>
        </div>

        <p className="text-center text-[#94A3B8] text-xs mt-6">
          © 2026 Ventra. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;