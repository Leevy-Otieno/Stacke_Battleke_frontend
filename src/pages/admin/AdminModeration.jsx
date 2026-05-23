// src/pages/admin/AdminModeration.jsx
// Moderation hub covering:
// - Banned users list with unban
// - Flagged / reported users with action
// - Quick platform announcement broadcaster (calls notification API)
// Designed to be extended as reporting endpoints are added to the backend.
import { useState, useCallback } from 'react';
import { Ban, UserCheck, ShieldAlert, Megaphone, RefreshCw } from 'lucide-react';
import { PageLoader, ErrorMessage } from '../../components/UI';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useAsync } from '../../hooks/useAsync';
import { fetchAdminUsers, toggleUserBan, broadcastNotification } from '../../services/api';

const TABS = [
  { id: 'banned',  label: 'Banned Users',    icon: <Ban size={16} /> },
  { id: 'flagged', label: 'Flagged Reports',  icon: <ShieldAlert size={16} /> },
  { id: 'broadcast', label: 'Announcements', icon: <Megaphone size={16} /> },
];

const AdminModeration = () => {
  const [tab, setTab]         = useState('banned');
  const [toast, setToast]     = useState(null);
  const [modal, setModal]     = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch banned users
  const bannedLoader = useCallback(() => fetchAdminUsers({ is_banned: true, perPage: 50 }), []);
  const { data: bannedData, loading: bL, error: bE, refetch: refetchBanned } = useAsync(bannedLoader);
  const banned = bannedData?.items || bannedData || [];

  // NOTE: Flagged/reports section uses placeholder until backend exposes GET /admin/reports.
  // The UI is ready; swap in a real API call when the endpoint exists.
  const flagged = []; // Replace with: useAsync(() => fetchAdminReports())

  const handleUnban = async () => {
    try {
      await toggleUserBan(modal.user.id);
      setToast({ type: 'success', message: `${modal.user.name} has been unbanned.` });
      setModal(null);
      refetchBanned();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    }
  };

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await broadcastNotification(message);
      setToast({ type: 'success', message: 'Announcement sent to all users.' });
      setMessage('');
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {modal?.type === 'unban' && (
        <ConfirmModal
          title="Unban User?"
          message={`${modal.user.name} will regain full access to the platform.`}
          confirmLabel="Unban"
          onConfirm={handleUnban}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Moderation</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage banned users, content reports, and platform announcements</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem', gap: '2px' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500',
              background: tab === t.id ? 'var(--bg-main)' : 'none',
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer',
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ---- BANNED USERS ---- */}
      {tab === 'banned' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Banned Users ({banned.length})</span>
            <button onClick={refetchBanned} style={{ background: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {bL && <div style={{ padding: '2rem', textAlign: 'center' }}><PageLoader /></div>}
          {bE && <ErrorMessage message={bE} onRetry={refetchBanned} />}

          {!bL && banned.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No banned users. Platform is clean 🎉
            </div>
          )}

          {!bL && banned.map((u) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-color)', gap: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
                {u.name?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{u.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
              </div>
              <button
                onClick={() => setModal({ type: 'unban', user: u })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.875rem', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', color: '#10B981', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                <UserCheck size={14} /> Unban
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---- FLAGGED REPORTS ---- */}
      {tab === 'flagged' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.5rem' }}>
          {flagged.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <ShieldAlert size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No reports yet</p>
              <p style={{ fontSize: '0.8rem' }}>
                This section will populate once the backend exposes <code style={{ fontFamily: 'monospace', backgroundColor: 'var(--bg-main)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>GET /api/admin/reports</code>.
              </p>
            </div>
          ) : (
            flagged.map((r) => (
              <div key={r.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{r.reason}</div>
            ))
          )}
        </div>
      )}

      {/* ---- BROADCAST ---- */}
      {tab === 'broadcast' && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Send Platform Announcement</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This will create a notification for every user on the platform.</p>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="e.g. New challenges are live this week! Check them out on the Challenges page."
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '7px', color: 'var(--text-primary)', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleBroadcast}
              disabled={sending || !message.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', borderRadius: '7px', backgroundColor: '#10B981', color: '#fff', fontWeight: '600', fontSize: '0.875rem', opacity: sending || !message.trim() ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
            >
              <Megaphone size={16} />
              {sending ? 'Sending…' : 'Broadcast Announcement'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminModeration;