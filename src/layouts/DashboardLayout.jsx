// File: src/layouts/DashboardLayout.jsx
// Dashboard layout for authenticated pages

import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { currentUser, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  
  // Handle responsive sidebar - moved outside of conditional
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // If user is not authenticated, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/chat')) return 'Chat';
    if (path.startsWith('/family-tree')) return 'Family Tree';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/events')) return 'Events';
    if (path.startsWith('/media')) return 'Media';
    return 'Dashboard';
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/family-tree', label: 'Family Tree', icon: '🌳' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/events', label: 'Events', icon: '📅' },
    { path: '/media', label: 'Media', icon: '📷' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader">
          <div className="spinner"></div>
          <p className="mt-4 text-primary-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob-1 animate-blob-slow"></div>
        <div className="blob-2 animate-blob-slow animation-delay-2000"></div>
        <div className="blob-3 animate-blob-slow animation-delay-4000"></div>
      </div>
      
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className={`fixed md:relative z-30 h-full ${
                isSidebarOpen ? 'w-64' : 'w-20'
              } card-glass shadow-glass flex flex-col`}
            >
              <div className="p-4 border-b border-white border-opacity-20 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center">
                  <span className="text-2xl mr-2">🌳</span>
                  {isSidebarOpen && (
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                      Vaanshika
                    </h2>
                  )}
                </Link>
                <button 
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  {isSidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-3">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                          location.pathname === item.path 
                            ? 'bg-primary-500 bg-opacity-20 text-primary-700 dark:text-primary-300' 
                            : 'hover:bg-white hover:bg-opacity-20 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {isSidebarOpen && (
                          <span className="ml-3 font-medium">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="p-4 border-t border-white border-opacity-20">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4a1 1 0 102 0V8zm-2 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium">Logout</span>
                  )}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <main className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 `}>
          {/* Header */}
          <header className="sticky top-0 z-10 glass-effect-strong shadow-sm p-4">
            <div className="container mx-auto flex items-center justify-between">
              {isMobile && (
                <button 
                  className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
                  onClick={toggleSidebar}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {getCurrentPageTitle()}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="avatar-sm mr-2 bg-primary-100 flex items-center justify-center text-primary-700">
                    {currentUser?.displayName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser?.displayName || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <div className="flex-1 overflow-y-auto h-[100%] p-4 md:p-6">
            <div className="container h-[100%]">
              <Outlet />
            </div>
          </div>
          
          {/* Footer */}
          {/* <footer className="glass-effect-light p-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vaanshika. All rights reserved.</p>
          </footer> */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 