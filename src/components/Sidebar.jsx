import React from 'react';
import { LayoutDashboard, Code2, Users2, Trophy, User, LogOut } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'arena', name: 'Arena', icon: Code2 },
    { id: 'groups', name: 'Groups', icon: Users2 },
    { id: 'leaderboards', name: 'Leaderboards', icon: Trophy },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <h1 className="text-xl font-bold text-brand-dark tracking-tight">Stack-Battle KE</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Academic Excellence</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-brand-lightBlue text-brand-blue' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => setCurrentPage('signup')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}