import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userString = localStorage.getItem('sb_user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;