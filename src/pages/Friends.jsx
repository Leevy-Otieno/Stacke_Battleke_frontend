import React, { useState, useCallback } from 'react';
import { fetchFriends, sendFriendRequest } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { PageLoader, ErrorMessage, FormError, SuccessBanner, EmptyState } from '../components/UI';
import { UserPlus } from 'lucide-react';

const Friends = () => {
  const [userId, setUserId]           = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [sending, setSending]         = useState(false);
  const [formError, setFormError]     = useState('');
  const [success, setSuccess]         = useState('');

  const fetcher = useCallback(() => fetchFriends(), []);
  const { data: friends, loading, error } = useAsync(fetcher);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    setSending(true);
    try {
      const res = await sendFriendRequest(userId);
      setSuccess(res.message);
      setUserId('');
      setShowAddForm(false);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Friends</h1>
          <p className="page-subtitle">{loading ? '…' : `${friends?.length ?? 0} friends`}</p>
        </div>
        <button
          onClick={() => { setShowAddForm((v) => !v); setFormError(''); setSuccess(''); }}
          className="btn-primary"
          style={{
            width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
            background:    showAddForm ? 'var(--bg-surface-hover)' : 'var(--primary-green)',
            border:        showAddForm ? '1px solid var(--border-color)' : '1px solid var(--primary-green)',
            color:         showAddForm ? 'var(--text-primary)' : 'white',
          }}
        >
          <UserPlus size={16} /> Add friend
        </button>
      </div>

      {success && <SuccessBanner message={success} />}

      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Send friend request by User ID</h3>
            <span onClick={() => setShowAddForm(false)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</span>
          </div>
          <FormError message={formError} />
          <form onSubmit={handleSendRequest} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Username ..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ margin: 0, flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }} disabled={sending}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            You can find user IDs on the <span style={{ color: 'var(--primary-green)' }}>leaderboard</span> or profile pages.
          </p>
        </div>
      )}

      {error   && <ErrorMessage message={error} />}
      {loading && <PageLoader />}
      {!loading && !error && friends?.length === 0 && (
        <EmptyState
          icon={<UserPlus size={48} />}
          title="No friends yet"
          subtitle="Send friend requests to connect with other coders"
        />
      )}
      {!loading && !error && friends?.map((f) => (
        <div key={f.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
            {f.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500' }}>{f.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{f.role} · {f.points} pts</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friends;
