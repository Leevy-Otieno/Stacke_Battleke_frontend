import React, { useCallback } from 'react';
import { PageLoader, ErrorMessage } from '../components/UI';
import ChallengeCard from '../components/ChallengeCard';
import { fetchChallenges } from '../services/api';
import { useAsync } from '../hooks/useAsync';

const Challenges = () => {
  const fetcher = useCallback(() => fetchChallenges(), []);
  const { data: challenges, loading, error, refetch } = useAsync(fetcher);

  const challengeList = challenges?.data || challenges || [];

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    // width: 100% ensures it pushes to the edges of your layout
    <div style={{ width: '100%' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">All Challenges</h1>
        <p className="page-subtitle">Test your skills, solve problems, and climb the leaderboard.</p>
      </div>
      
      {challengeList.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          // auto-fit ensures the cards stretch to consume 100% of the available empty space
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem',
          width: '100%'
        }}>
          {challengeList.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          color: 'var(--text-secondary)', 
          padding: '4rem 2rem', 
          backgroundColor: 'var(--bg-surface)', 
          borderRadius: '10px', 
          border: '1px solid var(--border-color)' 
        }}>
          No challenges have been published yet. Check back soon!
        </div>
      )}
    </div>
  );
};

export default Challenges;