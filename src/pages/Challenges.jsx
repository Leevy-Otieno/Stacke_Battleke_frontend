import React, { useState, useCallback } from 'react';
import { fetchChallenges } from '../services/api';
import ChallengeCard from '../components/ChallengeCard';
import { PageLoader, ErrorMessage, EmptyState } from '../components/UI';
import { useAsync } from '../hooks/useAsync';
import { Code2 } from 'lucide-react';

const FILTERS = ['All', 'Easy', 'Medium', 'Hard'];

const Challenges = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const fetcher = useCallback(
    async () => {
      const res = await fetchChallenges(
        activeFilter === 'All' ? 'all' : activeFilter
      );

      return res?.data || [];
    },
    [activeFilter]
  );

  const {
    data: challenges,
    loading,
    error,
    refetch,
  } = useAsync(fetcher, [activeFilter]);

  return (
    <div>
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 className="page-title">Challenges</h1>
          <p className="page-subtitle">
            {loading
              ? 'Loading…'
              : `${challenges?.length ?? 0} challenges available`}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {FILTERS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              background:
                activeFilter === tab
                  ? 'var(--primary-green)'
                  : 'transparent',
              color:
                activeFilter === tab
                  ? '#000'
                  : 'var(--text-secondary)',
              border:
                activeFilter === tab
                  ? 'none'
                  : '1px solid var(--border-color)',
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {loading && <PageLoader />}

      {!loading && !error && challenges?.length === 0 && (
        <EmptyState
          icon={<Code2 size={48} />}
          title="No challenges found"
          subtitle={`No ${activeFilter.toLowerCase()} challenges yet.`}
        />
      )}

      {!loading &&
        !error &&
        Array.isArray(challenges) &&
        challenges.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
    </div>
  );
};

export default Challenges;