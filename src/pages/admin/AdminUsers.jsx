import React, { useState, useCallback, useMemo } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchAdminUsers, toggleUserBan } from '../../services/api';
import { PageLoader, ErrorMessage, SuccessBanner, FormError } from '../../components/UI';
import { Shield, ShieldOff, Search } from 'lucide-react';

const AdminUsers = () => {
  const fetcher = useCallback(() => fetchAdminUsers(), []);
  const { data: initialUsers, loading, error, refetch } = useAsync(fetcher);
  
  const [users, setUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // 1. USE THE DEBOUNCE HOOK
  const debouncedSearch = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    if (initialUsers) setUsers(initialUsers);
  }, [initialUsers]);

  const handleToggleBan = async (user) => {
    if (user.role === 'admin') {
      setActionError("You cannot ban another administrator.");
      return;
    }

    setProcessingId(user.id);
    setActionError('');
    setActionSuccess('');

    try {
      await toggleUserBan(user.id);
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

  // 2. FILTER USING THE DEBOUNCED VALUE (Optimized)
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const query = debouncedSearch.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  }, [users, debouncedSearch]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* 3. TAILWIND REPLACES INLINE STYLES */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">User Management</h1>
          <p className="text-text-muted text-sm">Manage student accounts and permissions</p>
        </div>
        
        <div className="relative w-[300px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="input-field m-0 pl-10 bg-main border border-border rounded-md text-text-main w-full focus:border-primary"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <FormError message={actionError} />
      <SuccessBanner message={actionSuccess} />

      <div className="card p-0 overflow-hidden bg-surface border border-border rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-main border-b border-border text-sm text-text-muted">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Points</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                
                <td className="p-4">
                  <div className="font-medium text-text-main">{user.name}</div>
                  <div className="text-xs text-text-muted mt-1">{user.email}</div>
                </td>
                
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : 'bg-main text-text-muted'}`}>
                    {user.role}
                  </span>
                </td>
                
                <td className="p-4 font-semibold text-text-main">
                  {user.points.toLocaleString()}
                </td>
                
                <td className="p-4">
                  {user.is_active ? (
                    <span className="flex items-center gap-1 text-sm text-green-500">
                      <Shield size={14} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-red-500">
                      <ShieldOff size={14} /> Banned
                    </span>
                  )}
                </td>
                
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleBan(user)}
                      disabled={processingId === user.id}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        user.is_active 
                          ? 'border border-red-500 text-red-500 hover:bg-red-500/10' 
                          : 'bg-green-500 text-black hover:bg-green-600'
                      } disabled:opacity-50`}
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
          <div className="p-12 text-center text-text-muted">
            No users found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;