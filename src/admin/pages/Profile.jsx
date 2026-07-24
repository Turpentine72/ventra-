import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Briefcase, Edit2, Save, Lock } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    _id: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'Founder',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // For demo, using a hardcoded admin ID
      // In production, this would come from authentication
      const adminId = '67a1b2c3d4e5f6789a0b1c2d';
      const res = await axios.get(`http://localhost:5000/api/admin/profile/${adminId}`);
      setProfile(res.data);
      setFormData({
        fullName: res.data.fullName,
        email: res.data.email,
        phone: res.data.phone
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/profile/${profile._id}`, formData);
      setProfile(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    // In production, this would call an API to change password
    toast.success('Password changed successfully');
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse bg-white/5 rounded-2xl p-8">
            <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-white/10 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-[#94A3B8] text-sm">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-full flex items-center justify-center text-3xl font-bold text-[#0F172A]">
              {profile.fullName?.charAt(0) || 'A'}
            </div>
            <h2 className="text-xl font-semibold text-white mt-3">{profile.fullName}</h2>
            <p className="text-[#94A3B8] text-sm">{profile.role}</p>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-[#94A3B8] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                ) : (
                  <p className="text-white mt-1">{profile.fullName}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-[#94A3B8] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                ) : (
                  <p className="text-white mt-1">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[#94A3B8] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                ) : (
                  <p className="text-white mt-1">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Briefcase className="w-5 h-5 text-[#94A3B8] mt-1 flex-shrink-0" />
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Role</p>
                <p className="text-white mt-1">{profile.role}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: profile.fullName,
                      email: profile.email,
                      phone: profile.phone
                    });
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full transition-all duration-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </>
            )}
          </div>

          {/* Change Password Section */}
          {isChangingPassword && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-white font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-6 py-2.5 rounded-full transition-all duration-300"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;