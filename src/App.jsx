import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import { PageLoader } from './components/UI';

const Login          = lazy(() => import('./pages/Login'));
const Signup         = lazy(() => import('./pages/Signup'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const Challenges     = lazy(() => import('./pages/Challenges'));
const ChallengePage  = lazy(() => import('./pages/ChallengePage'));
const Leaderboard    = lazy(() => import('./pages/Leaderboard'));
const Groups         = lazy(() => import('./pages/Groups'));
const Friends        = lazy(() => import('./pages/Friends'));
const Notifications  = lazy(() => import('./pages/Notifications'));
const Profile        = lazy(() => import('./pages/Profile'));
const NotFound       = lazy(() => import('./pages/NotFound'));

const AdminLayout      = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers       = lazy(() => import('./pages/admin/AdminUsers'));
const AdminChallenges  = lazy(() => import('./pages/admin/AdminChallenges'));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions'));
const AdminModeration  = lazy(() => import('./pages/admin/AdminModeration'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<RoleBasedRedirect />} />

            <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/challenges"       element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
            <Route path="/challenges/:id"   element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/leaderboard"      element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/groups"           element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/friends"          element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/notifications"    element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index            element={<AdminDashboard />} />
                <Route path="users"       element={<AdminUsers />} />
                <Route path="challenges"  element={<AdminChallenges />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="moderation"  element={<AdminModeration />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;