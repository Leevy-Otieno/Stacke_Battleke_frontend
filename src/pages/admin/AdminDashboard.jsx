// src/pages/admin/AdminDashboard.jsx
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import { Users, Code, FileText, Activity } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard title="Total Users" value="1,284" icon={<Users size={20} />} trend="+12% this week" />
        <AdminStatsCard title="Total Challenges" value="48" icon={<Code size={20} />} />
        <AdminStatsCard title="Submissions" value="8,920" icon={<FileText size={20} />} trend="+5% this week" />
        <AdminStatsCard title="Active Now" value="34" icon={<Activity size={20} />} />
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500">Activity feed component coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;