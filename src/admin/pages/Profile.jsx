import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Briefcase, Edit2, Save, Lock, X } from 'lucide-react';
import { adminAPI } from '../../utils/supabase';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
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
            const adminId = localStorage.getItem('adminId');
            if (!adminId) {
                toast.error('Please login again');
                window.location.href = '/admin/login';
                return;
            }

            const data = await adminAPI.getProfile(adminId);
            setProfile(data);
            setFormData({
                fullName: data.full_name || '',
                email: data.email || '',
                phone: data.phone || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
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

    const handleSaveProfile = async () => {
        try {
            const adminId = localStorage.getItem('adminId');
            const updateData = {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone
            };
            
            await adminAPI.updateProfile(adminId, updateData);
            
            setProfile(prev => ({
                ...prev,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone
            }));
            
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
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

    if (!profile) {
        return (
            <div className="p-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-white/5 rounded-2xl p-8">
                        <User className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                        <h3 className="text-white text-lg font-semibold">No Profile Found</h3>
                        <p className="text-[#94A3B8] text-sm">Please contact support</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Profile</h1>
                    <p className="text-[#94A3B8] text-sm">Manage your account settings</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#B8962E] rounded-full flex items-center justify-center text-3xl font-bold text-[#0F172A]">
                            {profile.full_name?.charAt(0) || 'A'}
                        </div>
                        <h2 className="text-xl font-semibold text-white mt-3">{profile.full_name}</h2>
                        <p className="text-[#94A3B8] text-sm">{profile.role || 'Founder'}</p>
                    </div>

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
                                    <p className="text-white mt-1">{profile.full_name}</p>
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
                                <p className="text-white mt-1">{profile.role || 'Founder'}</p>
                            </div>
                        </div>
                    </div>

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
                                            fullName: profile.full_name || '',
                                            email: profile.email || '',
                                            phone: profile.phone || ''
                                        });
                                    }}
                                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
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

                    {isChangingPassword && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <h3 className="text-white font-semibold mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
                                />
                                <div className="flex gap-3">
                                    <button className="bg-[#D4AF37] hover:bg-[#C5A035] text-[#0F172A] font-semibold px-6 py-2.5 rounded-full">
                                        Update Password
                                    </button>
                                    <button
                                        onClick={() => setIsChangingPassword(false)}
                                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-full"
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