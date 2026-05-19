import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { getDifficultyColor } from '../utils/helpers';

const ChallengeCard = ({ challenge }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '1rem', 
        cursor: 'pointer', 
        transition: 'background 0.2s' 
      }}
      onClick={() => navigate(`/challenges/${challenge.id}`)}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
    >
      <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
        <Code2 size={24} />
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>
          {challenge.title}
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {challenge.desc}
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <span>⏱ {challenge.time}</span>
        <span style={{ color: 'var(--primary-green)' }}>+{challenge.points} pts</span>
        <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>
    </div>
  );
};

export default ChallengeCard;