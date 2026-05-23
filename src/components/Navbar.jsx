import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchNotifications } from '../services/api';
import {
  LayoutDashboard, Code2, Trophy, Users, UserPlus,
  Bell, LogOut, Zap, ShieldCheck,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications()
        .then((data) => {
          const unread = data.filter((n) => !n.read && !n.is_read).length;
          setUnreadCount(unread);
        })
        .catch(() => setUnreadCount(0));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard',     icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/challenges',    icon: <Code2 size={18} />,           label: 'Challenges' },
    { path: '/leaderboard',   icon: <Trophy size={18} />,          label: 'Leaderboard' },
    { path: '/groups',        icon: <Users size={18} />,           label: 'Groups' },
    { path: '/friends',       icon: <UserPlus size={18} />,        label: 'Friends' },
    { path: '/notifications', icon: <Bell size={18} />,            label: 'Notifications', badge: unreadCount > 0 ? unreadCount : null },
  ];

  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      backgroundColor: '#0B1120',          // --bg-main
      borderRight: '1px solid #1E293B',    // --border-color
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ backgroundColor: '#10B981', borderRadius: '6px', padding: '4px', color: '#000' }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#F8FAFC' }}>StackBattle</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Student Workspace</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.875rem', borderRadius: '7px',
              fontSize: '0.875rem', fontWeight: '500',
              textDecoration: 'none', transition: 'background 0.15s',
              color: isActive ? '#F8FAFC' : '#94A3B8',
              backgroundColor: isActive ? '#151F32' : 'transparent',
            })}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && <NotificationBell count={item.badge} />}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.875rem', borderRadius: '7px', marginTop: '0.5rem',
              color: isActive ? '#10B981' : '#10B981',
              backgroundColor: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.04)',
              border: '1px solid rgba(16,185,129,0.2)',
              transition: 'background 0.15s', textDecoration: 'none',
              fontWeight: '600', fontSize: '0.875rem',
            })}
          >
            <ShieldCheck size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User footer matching AdminSidebar */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.875rem', borderRadius: '7px',
            background: 'none', color: '#EF4444', fontSize: '0.875rem',
            fontWeight: '500', width: '100%', transition: 'background 0.15s',
            border: 'none', cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Small user identity strip */}
        <div 
          onClick={() => navigate('/profile')}
          style={{ 
            marginTop: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '7px', 
            backgroundColor: '#151F32', display: 'flex', alignItems: 'center', 
            gap: '0.6rem', cursor: 'pointer' 
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: '#F8FAFC', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'capitalize' }}>{user?.role || 'Student'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;