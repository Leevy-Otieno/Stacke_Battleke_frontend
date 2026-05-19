import React, { useState, useCallback } from 'react';
import { fetchLeaderboard } from '../services/api';
import UserCard from '../components/UserCard';
import { PageLoader, ErrorMessage } from '../components/UI';
import { useAsync } from '../hooks/useAsync';
import { Trophy, Users, Calendar } from 'lucide-react';

const TABS = [
  { id: 'Global', label: 'Global', icon: <Trophy size={16} /> },
  { id: 'Groups', label: 'Groups', icon: <Users size={16} /> },
  { id: 'Weekly', label: 'Weekly', icon: <Calendar size={16} /> },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Global');

  const fetcher = useCallback(() => fetchLeaderboard(activeTab.toLowerCase()), [activeTab]);
  const { data: users, loading, error, refetch } = useAsync(fetcher, [activeTab]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">See who's dominating the arena</p>
      </div>

      <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', padding: '0.25rem', marginBottom: '1.5rem' }}>
        {TABS.map(({ id, label, icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: isActive ? 'var(--bg-main)' : 'transparent',
                color:      isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s',
              }}
            >
              {isActive && icon}{label}
            </button>
          );
        })}
      </div>

      {error   && <ErrorMessage message={error} onRetry={refetch} />}
      {loading && <PageLoader />}
      {!loading && !error && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {users?.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
