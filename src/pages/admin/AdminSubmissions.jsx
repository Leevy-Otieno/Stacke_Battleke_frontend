import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const AdminSubmissions = () => {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    apiClient.get('/admin/submissions').then(res => setSubs(res.data));
  }, []);

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            {subs.length === 0 ? "No submissions yet." : (
                <ul>{subs.map(s => <li key={s.id}>{s.user_name} - {s.status}</li>)}</ul>
            )}
        </div>
    </div>
  );
};
export default AdminSubmissions;