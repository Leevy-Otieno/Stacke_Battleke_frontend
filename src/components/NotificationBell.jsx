import React from 'react';

const NotificationBell = ({ count }) => {
  if (!count) return null;
  return (
    <span style={{
      backgroundColor: 'var(--primary-green)', color: '#000',
      fontSize: '0.75rem', fontWeight: 'bold',
      padding: '0.1rem 0.4rem', borderRadius: '999px',
    }}>
      {count}
    </span>
  );
};

export default NotificationBell;
