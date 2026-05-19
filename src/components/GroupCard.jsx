import React from 'react';
import { Users, Lock } from 'lucide-react';

const GroupCard = ({ group, onJoin, joining }) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)',
    borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
  }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: '10px',
      backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--primary-green)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {group.isPublic ? <Users size={20} /> : <Lock size={20} />}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{group.name}</span>
        {!group.isPublic && (
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-main)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Private</span>
        )}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{group.description}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
        <Users size={12} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
        {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
      </p>
    </div>
    {onJoin && (
      <button
        onClick={() => onJoin(group.id)}
        disabled={joining === group.id}
        className="btn-primary"
        style={{ width: 'auto', padding: '0.4rem 1rem', fontSize: '0.875rem', opacity: joining === group.id ? 0.6 : 1 }}
      >
        {joining === group.id ? 'Joining…' : 'Join'}
      </button>
    )}
  </div>
);

export default GroupCard;
