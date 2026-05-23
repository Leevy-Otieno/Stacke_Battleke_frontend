import React, { useState, useCallback, useEffect } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { PageLoader, ErrorMessage, EmptyState } from '../components/UI';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const fetcher = useCallback(() => fetchNotifications(), []);
  const { data, loading, error } = useAsync(fetcher);
  
  const [notifications, setNotifications] = useState([]);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
  }, [data]);

  const unread = notifications.filter((n) => !n.read && !n.is_read).length;

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n))
    );
    await markNotificationRead(id);
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-KE', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{loading ? '…' : `${unread} unread`}</p>
        </div>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            style={{ 
              background: 'none', 
              color: 'var(--primary-green)', 
              fontSize: '0.875rem', 
              opacity: markingAll ? 0.6 : 1,
              cursor: markingAll ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {markingAll ? 'Marking…' : 'Mark all as read'}
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}
      {loading && <PageLoader />}
      {!loading && !error && notifications.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 2rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <Bell size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>All caught up</p>
          <p>No notifications yet.</p>
        </div>
      )}
      
      {!loading && !error && notifications.map((n) => {
        const isRead = n.read || n.is_read;
        const dateStr = n.createdAt || n.created_at;
        
        return (
          <div
            key={n.id}
            className="card"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'flex-start', 
              marginBottom: '1rem', 
              opacity: isRead ? 0.6 : 1, 
              transition: 'opacity 0.3s' 
            }}
          >
            <div style={{
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              marginTop: '6px', 
              flexShrink: 0,
              backgroundColor: isRead ? 'var(--border-color)' : 'var(--primary-green)',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{n.message}</div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ backgroundColor: 'var(--bg-main)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{n.type}</span>
                <span style={{ display: 'flex', alignItems: 'center' }}>{formatDate(dateStr)}</span>
              </div>
            </div>
            {!isRead && (
              <button
                onClick={() => handleMarkRead(n.id)}
                style={{ 
                  background: 'none', 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.75rem', 
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Mark read
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;