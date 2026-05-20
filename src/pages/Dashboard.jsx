import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Added apiClient to imports
import apiClient, { apiGetMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Zap, CheckCircle, Code } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [weekly, setWeekly] = useState(null);

  // =========================
  // LOAD WEEKLY CHALLENGE
  // =========================
  useEffect(() => {
    const loadWeekly = async () => {
      try {
        const res = await apiClient.get('/challenges/weekly');
        setWeekly(res.data?.data || null);
      } catch (err) {
        console.log('No weekly challenge found');
      }
    };

    loadWeekly();
  }, []);

  const stats = [
    {
      label: 'TOTAL POINTS',
      value: user?.points ?? 0,
      icon: <Trophy size={20} color="#F59E0B" />,
    },
    {
      label: 'RANK TIER',
      value: user?.role || 'Beginner',
      icon: <Zap size={20} color="var(--primary-green)" />,
    },
    {
      label: 'SOLVED',
      value: '0',
      icon: <CheckCircle size={20} color="var(--primary-green)" />,
    },
    {
      label: 'SUBMISSIONS',
      value: '1',
      icon: <Code size={20} color="#3B82F6" />,
    },
  ];

  const RANK_THRESHOLDS = {
    Beginner: 200,
    Intermediate: 500,
    Advanced: 1000,
    Elite: Infinity,
  };

  const nextThreshold = RANK_THRESHOLDS[user?.role] ?? 200;

  const pts = user?.points ?? 0;

  const progress = Math.min(
    100,
    Math.round((pts / nextThreshold) * 100)
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.name?.split(' ')[0] || 'Coder'}
        </h1>
        <p className="page-subtitle">
          Here's how you're doing
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {stats.map((s, i) => (
          <div key={i} className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              <span>{s.label}</span>
              {s.icon}
            </div>
            <div style={{ fontSize: '1.5rem' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
        }}
      >
        <div>
          {/* WEEKLY CHALLENGE (MVP SAFE) */}
          <div
            className="card"
            style={{
              backgroundColor: '#0B1A15',
              border: '1px solid #064E3B',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.75rem' }}>
                📅 WEEKLY CHALLENGE
                <span
                  style={{
                    marginLeft: '8px',
                    background: 'var(--primary-green)',
                    color: '#000',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Active
                </span>
              </div>

              <span className="badge badge-medium">
                {weekly?.difficulty || 'Medium'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem' }}>
              {weekly?.title || 'No Weekly Challenge Yet'}
            </h3>

            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
              {weekly?.description || 'Check back later for updates'}
            </p>

            <button
              className="btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                if (weekly?.id) {
                  navigate(`/challenges/${weekly.id}`);
                } else {
                  navigate('/challenges');
                }
              }}
            >
              Solve Now →
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          {/* Rank Progress */}
          <div className="card">
            <h3>Rank Progress</h3>

            <div>
              <span>{pts} pts</span> /{' '}
              <span>
                {nextThreshold === Infinity ? '∞' : nextThreshold}
              </span>
            </div>

            <div
              style={{
                height: '6px',
                background: '#222',
                borderRadius: '4px',
                marginTop: '0.5rem',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--primary-green)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;