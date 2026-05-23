// src/pages/admin/AdminUsers.jsx
// Full user management table with:
// - Real-time search (debounced)
// - Role filter
// - Promote / Demote admin
// - Ban / Unban
// - Delete (with confirmation modal)
// - Pagination
import { useState, useCallback, useEffect } from 'react';
import { Search, Shield, Ban, Trash2, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { PageLoader, ErrorMessage } from '../../components/UI';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchAdminUsers, updateUserRole, toggleUserBan, adminDeleteUser,
} from '../../services/api';

// Role badge colour helper
const roleBadge = (role) => ({
  admin:   { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA' },
  student: { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8' },
}[role] ?? { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8' });

const PER_PAGE = 15;

const AdminUsers = () => {
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage]           = useState(1);
  const [modal, setModal]         = useState(null); // { type, user }
  const [toast, setToast]         = useState(null);
  const [actionLoading, setAL]    = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  // Re-fetch when any filter changes
  const loader = useCallback(
    () => fetchAdminUsers({ search: debouncedSearch, role: roleFilter === 'all' ? undefined : roleFilter, page, perPage: PER_PAGE }),
    [debouncedSearch, roleFilter, page]
  );

  const { data, loading, error, refetch } = useAsync(loader, [debouncedSearch, roleFilter, page]);

  // Reset page when filter changes
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const users     = data?.items || data || [];
  const totalPages = data?.pages || 1;

  // ---- Action handlers ----

  const doAction = async (fn, successMsg) => {
    setAL(true);
    try {
      await fn();
      setToast({ type: 'success', message: successMsg });
      refetch();
    } catch (e) {
      setToast({ type: 'error', message: e.message });
    } finally {
      setAL(false);
      setModal(null);
    }
  };

  const handlePromote  = (u) => setModal({ type: 'promote', user: u });
  const handleDemote   = (u) => setModal({ type: 'demote',  user: u });
  const handleBanToggle = (u) => setModal({ type: u.is_banned ? 'unban' : 'ban', user: u });
  const handleDelete   = (u) => setModal({ type: 'delete',  user: u });

  const confirmAction = () => {
    const { type, user } = modal;
    if (type === 'promote') return doAction(() => updateUserRole(user.id, 'admin'),   `${user.name} promoted to admin.`);
    if (type === 'demote')  return doAction(() => updateUserRole(user.id, 'student'), `${user.name} demoted to student.`);
    if (type === 'ban')     return doAction(() => toggleUserBan(user.id),             `${user.name} has been banned.`);
    if (type === 'unban')   return doAction(() => toggleUserBan(user.id),             `${user.name} has been unbanned.`);
    if (type === 'delete')  return doAction(() => adminDeleteUser(user.id),           `${user.name} deleted.`);
  };

  const modalConfig = {
    promote: { title: 'Promote to Admin?',     message: `${modal?.user?.name} will gain full admin access. Are you sure?`,           confirmLabel: 'Promote',  danger: false },
    demote:  { title: 'Demote to Student?',    message: `${modal?.user?.name} will lose admin privileges.`,                          confirmLabel: 'Demote',   danger: true  },
    ban:     { title: 'Ban User?',             message: `${modal?.user?.name} will be blocked from logging in.`,                     confirmLabel: 'Ban User', danger: true  },
    unban:   { title: 'Unban User?',           message: `${modal?.user?.name} will regain access to the platform.`,                  confirmLabel: 'Unban',    danger: false },
    delete:  { title: 'Permanently Delete?',   message: `This will delete ${modal?.user?.name}'s account and all their data. This cannot be undone.`, confirmLabel: 'Delete', danger: true },
  };

  const cfg = modal ? modalConfig[modal.type] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Toast toast={toast} onClose={() => setToast(null)} />
      {modal && cfg && (
        <ConfirmModal {...cfg} onConfirm={confirmAction} onCancel={() => setModal(null)} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Users</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage all registered users</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem',
                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                borderRadius: '7px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none',
                width: '220px',
              }}
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '7px', color: 'var(--text-primary)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none' }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {['User', 'Role', 'Institution', 'Points', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}><PageLoader /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No users found.</td></tr>
              ) : users.map((u) => {
                const badge = roleBadge(u.role);
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.1s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e)  => e.currentTarget.style.backgroundColor = 'transparent'}>

                    {/* User */}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.875rem', flexShrink: 0 }}>
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600', backgroundColor: badge.bg, color: badge.color }}>
                        {u.role}
                      </span>
                    </td>

                    {/* Institution */}
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.institution || '—'}</td>

                    {/* Points */}
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: '600', color: '#10B981' }}>{(u.total_points ?? u.points ?? 0).toLocaleString()}</td>

                    {/* Status */}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {u.is_banned
                        ? <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>Banned</span>
                        : <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>Active</span>
                      }
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {/* Promote / Demote */}
                        {u.role !== 'admin'
                          ? <ActionBtn title="Promote to Admin" icon={<Shield size={15} />} color="#60A5FA" onClick={() => handlePromote(u)} disabled={actionLoading} />
                          : <ActionBtn title="Demote to Student" icon={<UserCheck size={15} />} color="#F59E0B" onClick={() => handleDemote(u)} disabled={actionLoading} />
                        }
                        {/* Ban / Unban */}
                        <ActionBtn title={u.is_banned ? 'Unban' : 'Ban'} icon={<Ban size={15} />} color={u.is_banned ? '#10B981' : '#F59E0B'} onClick={() => handleBanToggle(u)} disabled={actionLoading} />
                        {/* Delete */}
                        <ActionBtn title="Delete User" icon={<Trash2 size={15} />} color="#EF4444" onClick={() => handleDelete(u)} disabled={actionLoading} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1rem', borderTop: '1px solid var(--border-color)' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pagerBtn}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pagerBtn}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Tiny icon button used in each row's action column
const ActionBtn = ({ icon, title, color, onClick, disabled }) => (
  <button
    title={title}
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.4rem', borderRadius: '6px', background: 'none',
      color, border: '1px solid transparent', transition: 'background 0.15s',
      opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    onMouseOver={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = `${color}18`; }}
    onMouseOut={(e)  => { e.currentTarget.style.backgroundColor = 'transparent'; }}
  >
    {icon}
  </button>
);

const pagerBtn = {
  background: 'none', border: '1px solid var(--border-color)',
  borderRadius: '6px', padding: '0.3rem 0.5rem',
  color: 'var(--text-secondary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center',
};

export default AdminUsers;