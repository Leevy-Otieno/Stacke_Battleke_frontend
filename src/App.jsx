// src/App.jsx
// Root router. Admin routes are nested under AdminRoute (role guard)
// → AdminLayout (sidebar + content area).
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';          // NEW: role-based gate
import RoleBasedRedirect from './components/RoleBasedRedirect';
import { PageLoader } from './components/UI';

// ── Public & Student pages ────────────────────────────────────────────────
const Login          = lazy(() => import('./pages/Login'));
const Signup         = lazy(() => import('./pages/Signup'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const Challenges     = lazy(() => import('./pages/Challenges'));
const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Leaderboard    = lazy(() => import('./pages/Leaderboard'));
const Groups         = lazy(() => import('./pages/Groups'));
const Friends        = lazy(() => import('./pages/Friends'));
const Notifications  = lazy(() => import('./pages/Notifications'));
const Profile        = lazy(() => import('./pages/Profile'));
const NotFound       = lazy(() => import('./pages/NotFound'));

// ── Admin pages ───────────────────────────────────────────────────────────
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
            {/* ── Public ── */}
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ── Root redirect (student → /dashboard, admin → /admin) ── */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* ── Student protected routes ── */}
            <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/challenges"       element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
            <Route path="/challenges/:id"   element={<ProtectedRoute><ChallengeDetail /></ProtectedRoute>} />
            <Route path="/leaderboard"      element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/groups"           element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/friends"          element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/notifications"    element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* ── Admin routes (role === "admin" required) ── */}
            {/*
              Layout:
                /admin            → AdminRoute checks role
                  AdminLayout       → renders sidebar + <Outlet />
                    index           → AdminDashboard
                    users           → AdminUsers
                    challenges      → AdminChallenges
                    submissions     → AdminSubmissions
                    moderation      → AdminModeration
            */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index            element={<AdminDashboard />} />
                <Route path="users"       element={<AdminUsers />} />
                <Route path="challenges"  element={<AdminChallenges />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="moderation"  element={<AdminModeration />} />
              </Route>
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;