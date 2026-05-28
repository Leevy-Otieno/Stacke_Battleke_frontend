import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Code, FileText, ShieldAlert, LogOut, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard',   path: '/admin',             icon: <LayoutDashboard size={18} />, end: true },
  { name: 'Users',       path: '/admin/users',        icon: <Users size={18} /> },
  { name: 'Challenges',  path: '/admin/challenges',   icon: <Code size={18} /> },
  { name: 'Submissions', path: '/admin/submissions',  icon: <FileText size={18} /> },
  { name: 'Moderation',  path: '/admin/moderation',   icon: <ShieldAlert size={18} /> },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      backgroundColor: '#0B1120',          // match app's --bg-main
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
          <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
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
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Admin identity + actions */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {/* Quick back link to student app */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.875rem', borderRadius: '7px',
            background: 'none', color: '#94A3B8', fontSize: '0.875rem',
            fontWeight: '500', width: '100%', transition: 'background 0.15s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#151F32'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={18} />
          Back to App
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.65rem 0.875rem', borderRadius: '7px',
            background: 'none', color: '#EF4444', fontSize: '0.875rem',
            fontWeight: '500', width: '100%', transition: 'background 0.15s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Small admin identity strip */}
        <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.875rem', borderRadius: '7px', backgroundColor: '#151F32', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: '#F8FAFC', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#10B981' }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;