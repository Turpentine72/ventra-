import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Main Site Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ventra from './pages/Ventra';
import WaitlistPage from './pages/Waitlist';

// Admin Components
import AdminLayout from './admin/layout/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import Waitlist from './admin/pages/Waitlist';
import Profile from './admin/pages/Profile';

function App() {
  // Check if user is authenticated by checking for adminId
  const isAuthenticated = localStorage.getItem('adminId') !== null;

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Routes>
        {/* Main Site Routes */}
        <Route path="/" element={<><Navbar /><Ventra /><Footer /></>} />
        <Route path="/waitlist" element={<><Navbar /><WaitlistPage /><Footer /></>} />
        
        {/* Admin Login Route - Always accessible */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />
        } />
        <Route path="/admin/dashboard" element={
          isAuthenticated ? <AdminLayout><Dashboard /></AdminLayout> : <Navigate to="/admin/login" replace />
        } />
        <Route path="/admin/waitlist" element={
          isAuthenticated ? <AdminLayout><Waitlist /></AdminLayout> : <Navigate to="/admin/login" replace />
        } />
        <Route path="/admin/profile" element={
          isAuthenticated ? <AdminLayout><Profile /></AdminLayout> : <Navigate to="/admin/login" replace />
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;