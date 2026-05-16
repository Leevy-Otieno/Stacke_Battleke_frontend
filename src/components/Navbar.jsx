import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export default function Navbar({ title }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search challenges, users, or groups..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-brand-blue"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-500 hover:text-slate-800 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-brand-blue rounded-full"></span>
        </button>
        <button className="text-slate-500 hover:text-slate-800">
          <Settings size={20} />
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">John Doe</p>
            <p className="text-[11px] text-slate-400 font-medium">Elite Tier</p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
            alt="User profile" 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
          />
        </div>
      </div>
    </header>
  );
}