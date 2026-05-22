import React, { useState, useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { fetchAdminUsers, toggleUserBan } from '../../services/api';
import { PageLoader, ErrorMessage } from '../../components/UI';

const AdminUsers = () => {
  const { data: initialUsers, loading, error, refetch } = useAsync(fetchAdminUsers);
  const [users, setUsers] = useState([]);

  React.useEffect(() => { if (initialUsers) setUsers(initialUsers); }, [initialUsers]);

  const handleToggle = async (user) => {
    try {
      await toggleUserBan(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch (e) { alert(e.message); }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="page-title">Manage Users</h1>
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface)', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{u.name}</td>
                <td style={{ padding: '1rem' }}>{u.role}</td>
                <td style={{ padding: '1rem' }}>
                   <span style={{ color: u.is_active ? 'var(--primary-green)' : '#ef4444' }}>
                     {u.is_active ? 'Active' : 'Banned'}
                   </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {u.role !== 'admin' && (
                    <button onClick={() => handleToggle(u)} style={{ background: 'none', color: 'var(--primary-green)', fontSize: '0.875rem' }}>
                      {u.is_active ? 'Ban' : 'Unban'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminUsers;