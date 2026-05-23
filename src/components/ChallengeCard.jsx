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
        transition: 'background 0.2s',
        // This keeps the card from overflowing
        minWidth: 0 
      }}
      onClick={() => navigate(`/challenges/${challenge.id}`)}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
    >
      <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', color: 'var(--text-secondary)', flexShrink: 0 }}>
        <Code2 size={24} />
      </div>
      
      {/* Container for title and description */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {challenge.title}
        </h4>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)', 
          margin: 0,
          // Truncates long text to one line
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {challenge.desc}
        </p>
      </div>
      
      {/* Right side stats - flexShrink: 0 keeps these from getting squished */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        color: 'var(--text-secondary)', 
        fontSize: '0.875rem',
        flexShrink: 0 
      }}>
        <span style={{ whiteSpace: 'nowrap' }}>⏱ {challenge.time}</span>
        <span style={{ color: 'var(--primary-green)', whiteSpace: 'nowrap' }}>+{challenge.points} pts</span>
        <span className={`badge ${getDifficultyColor(challenge.difficulty)}`} style={{ whiteSpace: 'nowrap' }}>
          {challenge.difficulty}
        </span>
      </div>
    </div>
  );
};

export default ChallengeCard;