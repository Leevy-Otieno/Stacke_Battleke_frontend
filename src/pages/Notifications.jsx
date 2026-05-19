import React, { useState, useCallback } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { PageLoader, ErrorMessage, EmptyState } from '../components/UI';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const fetcher = useCallback(() => fetchNotifications(), []);
  const { data: initial, loading, error } = useAsync(fetcher);
  const [notifications, setNotifications] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  // Sync once loaded
  const list = notifications ?? initial ?? [];
  const unread = list.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      (prev ?? initial).map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationRead(id);
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => (prev ?? initial).map((n) => ({ ...n, read: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{loading ? '…' : `${unread} unread`}</p>
        </div>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            style={{ background: 'none', color: 'var(--primary-green)', fontSize: '0.875rem', opacity: markingAll ? 0.6 : 1 }}
          >
            {markingAll ? 'Marking…' : 'Mark all as read'}
          </button>
        )}
      </div>

      {error   && <ErrorMessage message={error} />}
      {loading && <PageLoader />}
      {!loading && !error && list.length === 0 && (
        <EmptyState icon={<Bell size={48} />} title="All caught up" subtitle="No notifications yet." />
      )}
      {!loading && !error && list.map((n) => (
        <div
          key={n.id}
          className="card"
          style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem', opacity: n.read ? 0.6 : 1, transition: 'opacity 0.3s' }}
        >
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
            backgroundColor: n.read ? 'var(--border-color)' : 'var(--primary-green)',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{n.message}</div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ backgroundColor: 'var(--bg-main)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{n.type}</span>
              <span>{formatDate(n.createdAt)}</span>
            </div>
          </div>
          {!n.read && (
            <button
              onClick={() => handleMarkRead(n.id)}
              style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Mark read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
