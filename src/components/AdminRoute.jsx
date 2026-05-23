// src/components/AdminRoute.jsx
// Guards every /admin/* route. If not logged in → /login.
// If logged in but not admin → /dashboard (no peeking).
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './UI';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  // While AuthContext is hydrating from localStorage, show nothing yet
  if (loading) return <PageLoader />;

  if (!user) return <Navigate to="/login" replace />;

  // Only users whose role is exactly "admin" may pass
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default AdminRoute;