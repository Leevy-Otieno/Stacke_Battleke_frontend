import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
  const userString = localStorage.getItem('sb_user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedRedirect;