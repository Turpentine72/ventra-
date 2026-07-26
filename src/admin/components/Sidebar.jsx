import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Logo from '../../assets/ventra-logo.png';

const Sidebar = ({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen, onLogout }) => {
  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/waitlist', icon: Users, label: 'Waitlist' },
    { path: '/admin/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={`h-full bg-[#0F172A] border-r border-white/5 flex flex-col transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Logo Section */}
      <div className={`flex items-center ${isOpen ? 'px-6' : 'px-4'} h-20 border-b border-white/5`}>
        <img 
          src={Logo} 
          alt="Ventra Logo" 
          className={`${isOpen ? 'h-10' : 'h-8'} w-auto object-contain`}
        />
        {isOpen && (
          <span className="ml-3 text-white font-bold text-xl tracking-tight">VENTRA</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' 
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }
              ${!isOpen && 'justify-center'}
            `}
          >
            <item.icon className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
            text-red-400 hover:text-red-300 hover:bg-red-500/10
            ${!isOpen && 'justify-center'}
          `}
        >
          <LogOut className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'}`} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </nav>

      {/* Toggle Button - Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex items-center justify-center h-12 border-t border-white/5 text-[#94A3B8] hover:text-white transition-colors"
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default Sidebar;