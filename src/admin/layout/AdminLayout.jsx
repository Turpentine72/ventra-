import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  // Check authentication - look for adminId
  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    console.log('AdminLayout - Checking auth, adminId:', adminId);
    if (!adminId) {
      console.log('No adminId found, redirecting to login');
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Remove all auth-related items
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminData');
    console.log('Logged out, cleared localStorage');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 text-white font-semibold">Ventra Admin</span>
        </header>

        {/* Page Content */}
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;