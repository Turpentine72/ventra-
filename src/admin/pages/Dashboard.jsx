import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  TrendingUp, 
  Star, 
  Building2,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newToday: 0,
    mostRequestedFeature: 'N/A',
    mostPopularCategory: 'N/A'
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage, search]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await axios.get('http://localhost:5000/api/waitlist/stats/summary');
      setStats(statsRes.data);

      // Fetch recent users
      const usersRes = await axios.get('http://localhost:5000/api/waitlist', {
        params: {
          search,
          limit: 5,
          page: currentPage
        }
      });
      setRecentUsers(usersRes.data.users);
      setTotalPages(usersRes.data.pages);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Waitlist Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-[#D4AF37]'
    },
    {
      title: 'New Today',
      value: stats.newToday,
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Most Requested Feature',
      value: stats.mostRequestedFeature,
      icon: Star,
      color: 'text-[#D4AF37]'
    },
    {
      title: 'Most Popular Category',
      value: stats.mostPopularCategory,
      icon: Building2,
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#94A3B8] text-sm">Overview of your waitlist</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94A3B8] text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-white/5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Waitlist */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Waitlist</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#D4AF37] w-full sm:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-xl p-4">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#94A3B8]">No waitlist users yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="pb-3 text-[#94A3B8] text-sm font-medium">Business Name</th>
                    <th className="pb-3 text-[#94A3B8] text-sm font-medium hidden md:table-cell">Full Name</th>
                    <th className="pb-3 text-[#94A3B8] text-sm font-medium hidden lg:table-cell">Email</th>
                    <th className="pb-3 text-[#94A3B8] text-sm font-medium hidden sm:table-cell">Category</th>
                    <th className="pb-3 text-[#94A3B8] text-sm font-medium hidden xl:table-cell">Feature</th>
                    <th className="pb-3 text-[#94A3B8] text-sm font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id} className="border-b border-white/5">
                      <td className="py-3 text-white text-sm">{user.businessName}</td>
                      <td className="py-3 text-white text-sm hidden md:table-cell">{user.fullName}</td>
                      <td className="py-3 text-[#94A3B8] text-sm hidden lg:table-cell">{user.email}</td>
                      <td className="py-3 text-[#94A3B8] text-sm hidden sm:table-cell">{user.businessCategory}</td>
                      <td className="py-3 text-[#94A3B8] text-sm hidden xl:table-cell">{user.featureInterest}</td>
                      <td className="py-3 text-[#94A3B8] text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
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
    </div>
  );
};

export default Dashboard;