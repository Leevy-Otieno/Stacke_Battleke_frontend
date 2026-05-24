import { useCallback } from 'react';
import { Users, Code, FileText, Activity, TrendingUp } from 'lucide-react';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import { PageLoader, ErrorMessage } from '../../components/UI';
import { useAsync } from '../../hooks/useAsync';
import { fetchAdminStats, fetchAdminUsers, fetchAdminSubmissions } from '../../services/api';

const StatusBadge = ({ status }) => {
  const isPass = status === 'Accepted' || status === 'Passed' || status === 'passed';
  return (
    <span style={{
      padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600',
      backgroundColor: isPass ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
      color: isPass ? '#10B981' : '#EF4444',
    }}>
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  const statsLoader    = useCallback(() => fetchAdminStats(), []);
  const usersLoader    = useCallback(() => fetchAdminUsers({ page: 1, perPage: 5 }), []);
  const subsLoader     = useCallback(() => fetchAdminSubmissions({ page: 1, perPage: 5 }), []);

  const { data: stats,   loading: sL, error: sE } = useAsync(statsLoader);
  const { data: users,   loading: uL }             = useAsync(usersLoader);
  const { data: submits, loading: subL }           = useAsync(subsLoader);

  if (sL) return <PageLoader />;
  if (sE) return <ErrorMessage message={sE} />;

  const statCards = [
    { title: 'Total Users',        value: stats?.total_users,        icon: <Users size={18} />,    trend: stats?.user_trend },
    { title: 'Total Challenges',   value: stats?.total_challenges,   icon: <Code size={18} />,     trend: null },
    { title: 'Total Submissions',  value: stats?.total_submissions,  icon: <FileText size={18} />, trend: stats?.submission_trend },
    { title: 'Active This Week',   value: stats?.active_users,       icon: <Activity size={18} />, trend: null },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Welcome back. Here's what's happening on StackBattle.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {statCards.map((card) => (
          <AdminStatsCard key={card.title} {...card} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', fontSize: '0.95rem' }}>Recent Signups</h3>
            <a href="/admin/users" style={{ fontSize: '0.78rem', color: '#10B981' }}>View all →</a>
          </div>

          {uL ? <PageLoader /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(users?.items || users || []).slice(0, 5).map((u) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.875rem', flexShrink: 0 }}>
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '999px', backgroundColor: u.role === 'admin' ? 'rgba(59,130,246,0.1)' : 'rgba(148,163,184,0.1)', color: u.role === 'admin' ? '#60A5FA' : 'var(--text-secondary)', fontWeight: '600' }}>
                    {u.role}
                  </span>
                </div>
              ))}
              {!(users?.items || users)?.length && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No users yet.</p>}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: '600', fontSize: '0.95rem' }}>Recent Submissions</h3>
            <a href="/admin/submissions" style={{ fontSize: '0.78rem', color: '#10B981' }}>View all →</a>
          </div>

          {subL ? <PageLoader /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(submits?.items || submits || []).slice(0, 5).map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <TrendingUp size={14} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontWeight: '500' }}>{s.user?.name || s.username || 'Unknown'}</span>
                      <span style={{ color: 'var(--text-secondary)' }}> → {s.challenge?.title || s.challenge_title || '?'}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s.language} · {s.created_at ? new Date(s.created_at).toLocaleDateString() : ''}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
              {!(submits?.items || submits)?.length && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No submissions yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;