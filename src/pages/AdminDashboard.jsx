import React, { useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { fetchAdminStats } from '../../services/api';
import { PageLoader, ErrorMessage } from '../../components/UI';
import { Users, Code, Activity, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const fetcher = useCallback(() => fetchAdminStats(), []);
  const { data: stats, loading, error, refetch } = useAsync(fetcher);

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!stats) return null;

  const kpis = [
    { label: 'Total Students', value: stats.total_users, icon: <Users size={24} color="#3B82F6" /> },
    { label: 'Total Submissions', value: stats.total_submissions, icon: <Code size={24} color="#10B981" /> },
    { label: 'Active Challenges', value: stats.active_challenges, icon: <ShieldCheck size={24} color="#F59E0B" /> },
    { label: 'Weekly Active Users', value: stats.weekly_active_users, icon: <Activity size={24} color="#A855F7" /> },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Admin Command Center</h1>
        <p className="page-subtitle">Platform overview and statistics</p>
      </div>

      {/* KPI GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '12px' }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpi.value.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Future space for Recharts graphs */}
      <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        [ Analytics Charts Will Go Here (Using Recharts) ]
      </div>
    </div>
  );
};

export default AdminDashboard;
