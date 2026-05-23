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
        gap: '1.25rem',
        cursor: 'pointer', 
        transition: 'background 0.2s',
        minWidth: 0,
        height: '100%',
        padding: '1.25rem'
      }}
      onClick={() => navigate(`/challenges/${challenge.id}`)}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
    >
      <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', color: 'var(--text-secondary)', flexShrink: 0 }}>
        <Code2 size={24} />
      </div>
      
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
          {challenge.title}
        </h4>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)', 
          margin: 0,
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {challenge.desc}
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem', 
        color: 'var(--text-secondary)', 
        fontSize: '0.875rem',
        flexShrink: 0 
      }}>
        <span style={{ whiteSpace: 'nowrap' }}>⏱ {challenge.time}</span>
        <span style={{ color: 'var(--primary-green)', whiteSpace: 'nowrap', fontWeight: '500' }}>+{challenge.points} pts</span>
        <span className={`badge ${getDifficultyColor(challenge.difficulty)}`} style={{ whiteSpace: 'nowrap' }}>
          {challenge.difficulty}
        </span>
      </div>
    </div>
  );
};

export default ChallengeCard;