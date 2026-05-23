// src/components/Navbar.jsx
// Student-facing sidebar nav.
// Shows an "Admin Panel" link only when user.role === "admin".
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Code2, Trophy, Users, UserPlus,
  Bell, LogOut, Zap, ShieldCheck,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { path: '/dashboard',      icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/challenges',     icon: <Code2 size={20} />,           label: 'Challenges' },
    { path: '/leaderboard',    icon: <Trophy size={20} />,          label: 'Leaderboard' },
    { path: '/groups',         icon: <Users size={20} />,           label: 'Groups' },
    { path: '/friends',        icon: <UserPlus size={20} />,        label: 'Friends' },
    { path: '/notifications',  icon: <Bell size={20} />,            label: 'Notifications', badge: 1 },
  ];

  return (
    <aside style={{
      width: '260px', backgroundColor: 'var(--bg-main)',
      borderRight: '1px solid var(--border-color)',
      position: 'fixed', height: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
        <div style={{ backgroundColor: 'var(--primary-green)', padding: '0.25rem', borderRadius: '6px', color: '#000' }}>
          <Zap size={24} fill="currentColor" />
        </div>
        StackBattle
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 1rem', borderRadius: '8px',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              marginBottom: '0.1rem', transition: 'background 0.15s',
              textDecoration: 'none',
            })}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && <NotificationBell count={item.badge} />}
          </NavLink>
        ))}

        {/* Admin Panel link — only visible to admins */}
        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 1rem', borderRadius: '8px', marginTop: '0.5rem',
              color: isActive ? '#10B981' : '#10B981',
              backgroundColor: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.04)',
              border: '1px solid rgba(16,185,129,0.2)',
              transition: 'background 0.15s', textDecoration: 'none',
              fontWeight: '600', fontSize: '0.875rem',
            })}
          >
            <ShieldCheck size={20} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)', fontWeight: '600' }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', width: '100%' }}
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;