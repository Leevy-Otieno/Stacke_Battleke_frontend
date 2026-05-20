import React, { useState, useCallback } from 'react';
import { fetchLeaderboard } from '../services/api';
import UserCard from '../components/UserCard';
import { PageLoader, ErrorMessage } from '../components/UI';
import { useAsync } from '../hooks/useAsync';
import { Trophy, Users, Calendar } from 'lucide-react';

const TABS = [
  { id: 'global', label: 'Global', icon: <Trophy size={16} /> },
  { id: 'groups', label: 'Groups', icon: <Users size={16} /> },
  { id: 'weekly', label: 'Weekly', icon: <Calendar size={16} /> },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global');

  // ✅ REAL backend-driven fetch
  const fetcher = useCallback(async () => {
    const res = await fetchLeaderboard(activeTab);

    // backend MUST always return { data: [...] }
    return res.data;
  }, [activeTab]);

  const {
    data: users,
    loading,
    error,
    refetch,
  } = useAsync(fetcher, [activeTab]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">
          Real-time rankings based on backend points
        </p>
      </div>

      {/* TABS */}
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '8px',
          padding: '0.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              background:
                activeTab === id
                  ? 'var(--bg-main)'
                  : 'transparent',
              color:
                activeTab === id
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={refetch}
        />
      )}

      {/* LOADING */}
      {loading && <PageLoader />}

      {/* LIST */}
      {!loading && !error && (
        <div className="card" style={{ padding: 0 }}>
          {users?.length > 0 ? (
            users.map((user, index) => (
              <UserCard
                key={user.id}
                user={{
                  ...user,
                  rank: index + 1, 
                }}
              />
            ))
          ) : (
            <div style={{ padding: 20 }}>
              No leaderboard data
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;