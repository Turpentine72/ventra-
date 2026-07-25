import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

const Waitlist = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    fashion: 0,
    restaurants: 0,
    schools: 0,
    other: 0
  });

  const categories = ['All', 'Fashion Brand', 'Restaurant', 'School', 'Real Estate', 'Beauty Business', 'Other'];

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [search, category, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/waitlist', {
        params: { search, category, page: currentPage, limit: 10 }
      });
      console.log('Fetched users:', res.data);
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/waitlist');
      const userList = res.data.users || [];
      
      const fashion = userList.filter(u => u.business_category === 'Fashion Brand').length;
      const restaurants = userList.filter(u => u.business_category === 'Restaurant').length;
      const schools = userList.filter(u => u.business_category === 'School').length;
      const other = userList.filter(u => !['Fashion Brand', 'Restaurant', 'School'].includes(u.business_category)).length;

      setStats({
        total: userList.length,
        fashion,
        restaurants,
        schools,
        other
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      console.log('Deleting user with ID:', id);
      const response = await api.delete(`/waitlist/${id}`);
      console.log('Delete response:', response.data);
      
      toast.success('User deleted successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data?.message || 'Failed to delete user');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.total, icon: Users },
    { label: 'Fashion Brands', value: stats.fashion, icon: Building2 },
    { label: 'Restaurants', value: stats.restaurants, icon: Building2 },
    { label: 'Schools', value: stats.schools, icon: Building2 },
    { label: 'Other Businesses', value: stats.other, icon: Building2 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Waitlist Management</h1>
        <p className="text-[#94A3B8] text-sm">Manage all waitlist submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <stat.icon className="w-4 h-4 text-[#D4AF37]" />
              <p className="text-[#94A3B8] text-xs">{stat.label}</p>
            </div>
            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37] appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-xl p-4">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#94A3B8]">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left text-[#94A3B8] text-sm font-medium">Business</th>
                    <th className="px-4 py-3 text-left text-[#94A3B8] text-sm font-medium hidden md:table-cell">Name</th>
                    <th className="px-4 py-3 text-left text-[#94A3B8] text-sm font-medium hidden lg:table-cell">Email</th>
                    <th className="px-4 py-3 text-left text-[#94A3B8] text-sm font-medium hidden sm:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-[#94A3B8] text-sm font-medium hidden xl:table-cell">Feature</th>
                    <th className="px-4 py-3 text-left text-[#94A3B8] text-sm font-medium hidden xl:table-cell">Date</th>
                    <th className="px-4 py-3 text-right text-[#94A3B8] text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    // Get the correct ID field (Supabase uses 'id', MongoDB uses '_id')
                    const userId = user.id || user._id;
                    return (
                      <tr key={userId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white text-sm">{user.business_name || user.businessName || 'N/A'}</td>
                        <td className="px-4 py-3 text-white text-sm hidden md:table-cell">{user.full_name || user.fullName || 'N/A'}</td>
                        <td className="px-4 py-3 text-[#94A3B8] text-sm hidden lg:table-cell">{user.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-[#94A3B8] text-sm hidden sm:table-cell">{user.business_category || user.businessCategory || 'N/A'}</td>
                        <td className="px-4 py-3 text-[#94A3B8] text-sm hidden xl:table-cell">{user.feature_interest || user.featureInterest || 'N/A'}</td>
                        <td className="px-4 py-3 text-[#94A3B8] text-sm hidden xl:table-cell">{formatDate(user.created_at || user.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(user)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(userId)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#94A3B8] hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[#94A3B8] text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Business Name</p>
                <p className="text-white mt-1">{selectedUser.business_name || selectedUser.businessName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Full Name</p>
                <p className="text-white mt-1">{selectedUser.full_name || selectedUser.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Email</p>
                <p className="text-white mt-1">{selectedUser.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Phone</p>
                <p className="text-white mt-1">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Business Category</p>
                <p className="text-white mt-1">{selectedUser.business_category || selectedUser.businessCategory || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Feature Requested</p>
                <p className="text-white mt-1">{selectedUser.feature_interest || selectedUser.featureInterest || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Date Joined</p>
                <p className="text-white mt-1">{formatDate(selectedUser.created_at || selectedUser.createdAt)}</p>
              </div>
              {selectedUser.instagram && (
                <div>
                  <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">Instagram</p>
                  <p className="text-white mt-1">{selectedUser.instagram}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Waitlist;