import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // Grab the user from localStorage (or your AuthContext if you prefer)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 1. Not logged in? Send to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but NOT an admin? Send to student dashboard.
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. User is an admin? Render the nested admin components!
  return <Outlet />;
};

export default AdminRoute;