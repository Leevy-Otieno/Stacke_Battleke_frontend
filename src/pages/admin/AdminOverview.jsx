import React from 'react';
import { Users, Code, Activity } from 'lucide-react';

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: 'Total Users', val: '0', icon: <Users color="#10b981" /> },
            { label: 'Challenges', val: '0', icon: <Code color="#3b82f6" /> },
            { label: 'Submissions', val: '0', icon: <Activity color="#f59e0b" /> },
        ].map(stat => (
            <div key={stat.label} className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold">{stat.val}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default AdminOverview;