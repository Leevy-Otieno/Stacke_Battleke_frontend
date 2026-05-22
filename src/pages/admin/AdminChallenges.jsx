import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await apiClient.get('/challenges');
      setChallenges(res.data?.data || []);
    };
    load();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Challenges</h1>
        <button className="btn-primary" style={{ width: 'auto' }}>+ Create Challenge</button>
      </div>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {challenges.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600' }}>{c.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.difficulty}</div>
            </div>
            <button style={{ background: 'none', color: '#ef4444', fontSize: '0.875rem' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminChallenges;