import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Code, Activity, User, LogOut, Zap } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
    { path: '/admin/challenges', label: 'Challenges', icon: <Code size={20} /> },
    { path: '/admin/submissions', label: 'Submissions', icon: <Activity size={20} /> },
    { path: '/admin/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">
        <div className="p-6 font-bold text-lg text-white flex items-center gap-2">
            <Zap className="text-emerald-500" fill="currentColor" /> Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/admin'}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => navigate('/')} className="p-6 text-slate-500 hover:text-white flex items-center gap-2">
           <LogOut size={16} /> Exit Admin
        </button>
      </aside>
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminDashboard;