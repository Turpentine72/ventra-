import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Users, TrendingUp, Star, Building2 } from 'lucide-react';
import { waitlistAPI } from '../../utils/supabase';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        newToday: 0,
        mostRequestedFeature: 'N/A',
        mostPopularCategory: 'N/A'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await waitlistAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Waitlist Users', value: stats.totalUsers, icon: Users },
        { title: 'New Today', value: stats.newToday, icon: TrendingUp },
        { title: 'Most Requested Feature', value: stats.mostRequestedFeature, icon: Star },
        { title: 'Most Popular Category', value: stats.mostPopularCategory, icon: Building2 },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-[#94A3B8] text-sm">Overview of your waitlist</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#94A3B8] text-sm">{stat.title}</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {loading ? '...' : stat.value}
                                </p>
                            </div>
                            <div className={`p-3 bg-white/5 rounded-xl text-[#D4AF37]`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;