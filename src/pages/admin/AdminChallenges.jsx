import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api'; // Use your centralized client

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  
  const fetchChallenges = async () => {
    try {
      const res = await apiClient.get('/challenges'); // Using centralized client
      setChallenges(res.data?.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchChallenges(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Challenges</h1>
      <div className="grid gap-4">
        {challenges.map(c => (
          <div key={c.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{c.title}</h3>
              <p className="text-xs text-slate-400">{c.difficulty}</p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminChallenges;