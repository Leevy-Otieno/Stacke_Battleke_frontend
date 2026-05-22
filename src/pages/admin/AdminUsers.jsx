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
    <div className="max-w-250 mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm">Manage student accounts and permissions</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-75">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <FormError message={actionError} />
      <SuccessBanner message={actionSuccess} />

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Points</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                
                <td className="p-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                </td>
                
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                
                <td className="p-4 font-semibold text-gray-900">
                  {user.points.toLocaleString()}
                </td>
                
                <td className="p-4">
                  {user.is_active ? (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <Shield size={14} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-red-600">
                      <ShieldOff size={14} /> Banned
                    </span>
                  )}
                </td>
                
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleBan(user)}
                      disabled={processingId === user.id}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors font-medium ${
                        user.is_active 
                          ? 'border border-red-500 text-red-600 hover:bg-red-50' 
                          : 'bg-green-600 text-white hover:bg-green-700'
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
          <div className="p-12 text-center text-gray-500">
            No users found matching "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;