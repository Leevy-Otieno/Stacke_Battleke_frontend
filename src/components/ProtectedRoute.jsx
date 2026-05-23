import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './UI';
import Navbar from './Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. If we are still checking the backend for the user session, show a loader
  // This prevents the "flash" to login before the user is confirmed.
  if (loading) {
    return <PageLoader />;
  }

  // 2. Only redirect if we are sure there is no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the app layout
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default ProtectedRoute;