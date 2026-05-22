import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiClient.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const handleUpdatePoints = async (id, currentPoints) => {
    const val = prompt("Set new points:", currentPoints);
    if (val) await apiClient.patch(`/admin/users/${id}/points`, { points: val });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs uppercase text-slate-400">
            <tr><th className="p-4">Name</th><th className="p-4">Points</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-4">{u.name}</td>
                <td className="p-4 font-bold">{u.points} <button onClick={() => handleUpdatePoints(u.id, u.points)} className="text-emerald-500 ml-2">✎</button></td>
                <td className="p-4"><button className="text-red-400">Ban</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminUsers;