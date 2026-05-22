import React, { useState, useCallback, useMemo } from 'react';
import { fetchAdminUsers, toggleUserBan } from '../../services/api';
import { useAsync } from '../../hooks/useAsync';
import { Search, Shield, ShieldOff } from 'lucide-react';

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

  if (loading) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/50">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">
                  <span className={u.is_active ? 'text-emerald-500' : 'text-red-500'}>
                    {u.is_active ? 'Active' : 'Banned'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {u.role !== 'admin' && (
                    <button onClick={() => handleToggle(u)} className="text-blue-400 hover:text-blue-300">
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