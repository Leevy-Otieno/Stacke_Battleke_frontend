import React from 'react';

const UserCard = ({ user }) => {
  const isMe = user.name.includes('(you)');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '1rem 1.5rem',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: isMe ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
    }}>
      <div style={{ width: '40px', color: 'var(--text-secondary)', fontWeight: '600' }}>{user.rank}</div>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem', fontWeight: '600' }}>
        {user.name.charAt(0)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', color: isMe ? 'var(--primary-green)' : 'var(--text-primary)' }}>{user.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          <span style={{
            backgroundColor: 'var(--bg-main)', padding: '0.1rem 0.5rem', borderRadius: '4px',
            color: user.role === 'Elite' ? '#F59E0B' : user.role === 'Advanced' ? '#A855F7' : 'var(--text-secondary)',
          }}>
            {user.role}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: '600' }}>{user.points.toLocaleString()}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>points</div>
      </div>
    </div>
  );
};

export default UserCard;
