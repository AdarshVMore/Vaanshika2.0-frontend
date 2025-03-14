// File: src/layouts/AuthLayout.jsx
// Authentication layout for login, register, and forgot password pages

import React from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthLayout = () => {
  const { currentUser, loading } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (!loading && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob-1 animate-blob-slow"></div>
        <div className="blob-2 animate-blob-slow animation-delay-2000"></div>
        <div className="blob-3 animate-blob-slow animation-delay-4000"></div>
        <div className="bg-gradient-to-b from-primary-50/30 to-secondary-50/30 absolute inset-0"></div>
      </div>

      {/* Header with logo */}
      <header className="absolute top-0 left-0 w-full py-6 px-4">
        <div className="container mx-auto flex items-center justify-start">
          <Link to="/" className="flex items-center justify-center">
            <span className="text-3xl leading-none">🌳</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent m-2">
              Vaanshika
            </h1>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center min-h-screen py-16 px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full py-4 px-4 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Vaanshika. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
