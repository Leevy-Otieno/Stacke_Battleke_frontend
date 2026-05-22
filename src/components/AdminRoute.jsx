import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check the role we added to the database!
  if (user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#EF4444' }}>
        <ShieldAlert size={64} style={{ marginBottom: '1rem' }} />
        <h2>Access Denied</h2>
        <p>You do not have administrator privileges.</p>
        <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ width: 'auto', marginTop: '1rem' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  // If they are an admin, render the nested admin routes
  return <Outlet />;
};

export default AdminRoute;
