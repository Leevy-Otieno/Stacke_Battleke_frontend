import React, { useState, useCallback } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { fetchAdminUsers, toggleUserBan } from '../../services/api';
import { PageLoader, ErrorMessage, SuccessBanner, FormError } from '../../components/UI';
import { Shield, ShieldOff, Search } from 'lucide-react';

const AdminUsers = () => {
  // Fetch users from the admin endpoint
  const fetcher = useCallback(() => fetchAdminUsers(), []);
  const { data: initialUsers, loading, error, refetch } = useAsync(fetcher);
  
  // Local state for optimistic UI updates and search
  const [users, setUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Sync fetched data to local state
  React.useEffect(() => {
    if (initialUsers) setUsers(initialUsers);
  }, [initialUsers]);

  const handleToggleBan = async (user) => {
    // Prevent banning other admins
    if (user.role === 'admin') {
      setActionError("You cannot ban another administrator.");
      return;
    }

    setProcessingId(user.id);
    setActionError('');
    setActionSuccess('');

    try {
      await toggleUserBan(user.id);
      
      // Optimistically update the UI so we don't have to refetch everything
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      ));
      
      setActionSuccess(`User ${user.name} has been ${user.is_active ? 'banned' : 'reactivated'}.`);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  // Filter users based on search
  const filteredUsers = (users || []).filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage student accounts and permissions</p>
        </div>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
            <Search size={16} />
          </div>
          <input
            type="text"
            className="input-field"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ margin: 0, paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <FormError message={actionError} />
      <SuccessBanner message={actionSuccess} />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>User</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Points</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                
                {/* User Info */}
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontWeight: '500' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                </td>
                
                {/* Role Badge */}
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span className="badge" style={{ backgroundColor: user.role === 'admin' ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-main)', color: user.role === 'admin' ? '#A855F7' : 'var(--text-secondary)' }}>
                    {user.role}
                  </span>
                </td>
                
                {/* Points */}
                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                  {user.points}
                </td>
                
                {/* Status Badge */}
                <td style={{ padding: '1rem 1.5rem' }}>
                  {user.is_active ? (
                    <span style={{ color: 'var(--primary-green)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Shield size={14} /> Active
                    </span>
                  ) : (
                    <span style={{ color: '#EF4444', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldOff size={14} /> Banned
                    </span>
                  )}
                </td>
                
                {/* Actions */}
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleBan(user)}
                      disabled={processingId === user.id}
                      className="btn-primary" 
                      style={{ 
                        width: 'auto', 
                        padding: '0.4rem 0.8rem', 
                        fontSize: '0.75rem',
                        backgroundColor: user.is_active ? 'transparent' : 'var(--primary-green)',
                        border: user.is_active ? '1px solid #EF4444' : 'none',
                        color: user.is_active ? '#EF4444' : '#000',
                      }}
                    >
                      {processingId === user.id ? 'Processing...' : (user.is_active ? 'Ban User' : 'Unban User')}
                    </button>
                  )}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No users found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
