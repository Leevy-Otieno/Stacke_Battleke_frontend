import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Code, Zap, LogOut, User } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
    { path: '/admin/challenges', label: 'Challenges', icon: <Code size={20} /> },
    { path: '/admin/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar: Styled exactly like your Navbar.jsx */}
      <aside style={{ width: '260px', backgroundColor: 'var(--bg-main)', borderRight: '1px solid var(--border-color)', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--primary-green)', padding: '0.25rem', borderRadius: '6px', color: '#000' }}>
            <Zap size={24} fill="currentColor" />
          </div>
          Admin Panel
        </div>

        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                marginBottom: '0.25rem', transition: 'background 0.15s',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', width: '100%' }}>
            <LogOut size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;