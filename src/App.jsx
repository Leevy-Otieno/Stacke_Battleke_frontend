import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import { PageLoader } from './components/UI';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Challenges = lazy(() => import('./pages/Challenges'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Groups = lazy(() => import('./pages/Groups'));
const Friends = lazy(() => import('./pages/Friends'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminChallenges = lazy(() => import('./pages/admin/AdminChallenges'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Root Redirector: Automatically sends Admin -> /admin, Student -> /dashboard */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Student/User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
            <Route path="/challenges/:id" element={<ProtectedRoute><ChallengeDetail /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              {/* AdminDashboard acts as the Layout shell for sidebar/nav */}
              <Route element={<AdminDashboard />}>
                <Route index element={<div className="text-xl font-bold p-8">Welcome Admin Command Center</div>} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="challenges" element={<AdminChallenges />} />
              </Route>
            </Route>

            <Route element={<AdminDashboard />}>
              <Route index element={<div className="p-8 text-xl font-bold">Welcome Admin</div>} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="challenges" element={<AdminChallenges />} />
              {/* Add this line: */}
              <Route path="profile" element={<Profile />} /> 
            </Route>

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;